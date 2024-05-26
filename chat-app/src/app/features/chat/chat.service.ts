import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, from, fromEventPattern, Observable, retry, throwError} from 'rxjs';
import {Message} from './message';
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {environment} from "../../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private backendUrl = environment.apiUrl;
  private messagesEndpoint = this.backendUrl + 'messages';

  private hubConnection!: HubConnection;

  constructor(private readonly http: HttpClient,
              private readonly matSnackBar: MatSnackBar) {
  }

  public startConnection(): Observable<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.backendUrl + 'chathub') // Adjust the URL to match your server
      .build();

    return from(this.hubConnection.start()).pipe(
      catchError(error => {
        this.matSnackBar.open("Error while starting connection", "Ok", {duration: 3000});
        console.error('Error while starting connection:', error);
        return throwError(() => new Error('Failed to start connection; please try again later.'));
      })
    );
  }

  public sendMessage = (user: string, message: string): Observable<void> => {
    return from(this.hubConnection.invoke('SendMessage', user, message))
      .pipe(
        catchError(this.handleHttpError)
      );
  };

  public receiveMessage(): Observable<{ user: string, message: string }> {
    return fromEventPattern<{ user: string, message: string }>(
      this.subscribeToReceiveMessageEvent.bind(this),
      this.unsubscribeFromReceiveMessageEvent.bind(this)
    );
  }

  private subscribeToReceiveMessageEvent(handler: (value: any) => void): void {
    this.hubConnection.on('ReceiveMessage', (user, message) => handler({user, message}));
  }

  private unsubscribeFromReceiveMessageEvent(handler: (value: any) => void): void {
    this.hubConnection.off('ReceiveMessage', handler);
  }

  public getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.messagesEndpoint).pipe(
      retry(),
      catchError(this.handleHttpError)
    );
  }

  // TODO Verlagern in eine Error handling klasse/service
  private handleHttpError(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.matSnackBar.open("An Error Ocurred", "Ok", {duration: 3000})
      console.error('An error occurred:', error.error);
    } else {
      this.matSnackBar.open("A Server Error Ocurred: " + error.error, "Ok", {duration: 3000})
      console.error(
        `Server returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Failed to get messages; please try again later.'));
  }
}
