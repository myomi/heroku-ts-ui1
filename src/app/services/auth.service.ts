import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AUTH_CONFIG } from "./auth0-variables";
import * as auth0 from "auth0-js";
import * as jwt_decode from "jwt-decode";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import IdTokenVerifier from "idtoken-verifier";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: "token id_token",
    redirectUri: AUTH_CONFIG.callbackURL
  });

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  constructor(private router: Router, private http: HttpClient) {
    this._idToken = "";
    this._accessToken = "";
    this._expiresAt = 0;
  }

  public login(email: string, password: string): void {
    this.auth0.login(
      {
        email,
        password,
        realm: "Username-Password-Authentication"
      },
      error => {
        // login error
        debugger;
      }
    );
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = "";
    this._idToken = "";
    this._expiresAt = 0;

    this.auth0.logout({
      returnTo: window.location.origin
    });
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
        this.router.navigate(["/home"]);
      } else if (err) {
        this.router.navigate(["/home"]);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`
        );
        this.logout();
      }
    });
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry
    return this._accessToken && Date.now() < this._expiresAt;
  }

  public verifyIdToken(): void {
    const verifier = new IdTokenVerifier({
      issuer: `https://${AUTH_CONFIG.domain}/`,
      audience: AUTH_CONFIG.clientID
    });
    const decoded = verifier.decode(this.idToken);
    verifier.verify(this.idToken, decoded.payload.nonce, (error, payload) => {
      if (error) {
        // 不正なIDトークン
      } else {
        // ここで payload の内容を検証する
      }
    });
  }

  private localLogin(authResult: auth0.Auth0DecodedHash): void {
    // Set the time that the access token will expire at
    const expiresAt = authResult.expiresIn * 1000 + Date.now();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;
  }
}

/**
 * https://tools.ietf.org/html/rfc7517#section-4
 */
interface JWKS {
  keys: {
    kty: string;
    alg: string;
    use: string;
    kid: string;
    n: string;
    e: string;
    x5c: string[];
    x5t: string;
  }[];
}
