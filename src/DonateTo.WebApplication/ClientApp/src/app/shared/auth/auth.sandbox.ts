import { AuthConfigService } from '../../shared/auth/auth.config';
import { Injectable } from '@angular/core';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { Sandbox } from '../sandbox/base.sandbox';
import { Store } from '@ngrx/store';
import * as store from '../store';
import { Router } from '@angular/router';

@Injectable()
export class AuthSandbox extends Sandbox {
  constructor(
    protected appState$: Store<store.State>,
    private authService: OAuthService,
    private authConfigService: AuthConfigService,
    private router: Router
  ) {
    super(appState$);
  }

  /**
   * Sets up Auth configuration
   * Subscribes to service token event changes
   */
  public setupAuth(): void {
    const authConfig = this.authConfigService.getConfig();
    this.authService.configure(authConfig);
    this.authService.setupAutomaticSilentRefresh();
    this.appState$.dispatch(store.fromAuth.tryLogin());
    this.subscriptions.push(this.authService.events.subscribe(this.handleAuthEvents.bind(this)));
  }

  /**
   * Dispatches a login action to redirect to the login page
   */
  public login(additionalState?: string, params?: {}): void {
    this.authService.initCodeFlow(additionalState, params);
  }

  public register(): void {
    document.location.href = this.authService.issuer + '/Account/Register?returnUrl=' + this.authService.redirectUri;
  }

  public forgotPassword(): void {
    document.location.href = this.authService.issuer + '/Account/ChangePassword?returnUrl=' + window.location.href;
  }

  /**
   * Dispatches a logout action to redirect to identity provider logout page
   */
  public logout(): void {
    this.authService.logOut();
  }

  /**
   * Checks if the token in the session store is valid and updates the ngrx store
   */
  public validateToken(): boolean {
    if (this.authService.hasValidAccessToken()) {
      this.appState$.dispatch(store.fromAuth.validateTokenSucess());
      return true;
    }

    this.appState$.dispatch(store.fromAuth.validateTokenFailed());
    return false;
  }

  /**
   * Dispatches a load user profile action when
   * an token event of type received or refreshed
   * is raised
   */
  public handleAuthEvents(event: OAuthEvent): void {
    switch (event.type) {
      case 'token_received':
        this.appState$.dispatch(store.fromAuth.loadUserProfile());
        this.manageRedirection();
        break;
      case 'token_refreshed':
        this.appState$.dispatch(store.fromAuth.loadUserProfile());
        break;
    }
  }

  private manageRedirection(): void {
    if (this.authService.state) {
      const pathSlash = '/';
      const decodedURIComponent = decodeURIComponent(this.authService.state);
      if (this.router.url !== pathSlash.concat(decodedURIComponent)) {
        this.router.navigate([decodedURIComponent]);
      }
    }
  }
}
