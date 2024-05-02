import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Message} from '../models/message';
import {HubConnection} from "@microsoft/signalr";
import {HubConnectionBuilder} from "@microsoft/signalr";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private backendUrl = environment.apiUrl;
  private messagesEndpoint = this.backendUrl + 'messages';

  private hubConnection!: HubConnection;

  constructor(private http: HttpClient) {}

  public startConnection = async (): Promise<void> => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.backendUrl + 'chathub') // Adjust the URL to match your server
      .build();

    try {
      await this.hubConnection
        .start();
      return console.log('Connection started');
    } catch (err) {
      return console.log('Error while starting connection: ' + err);
    }
  };

  public sendMessage = async (user: string, message: string): Promise<void> => {
    try {
      return await this.hubConnection.invoke('SendMessage', user, message);
    } catch (err) {
      return console.error(err);
    }
  };

  public receiveMessage = (callback: (user: string, message: string) => void): void => {
    this.hubConnection.on('ReceiveMessage', (user, message) => {
      callback(user, message);
    });
  };

  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.messagesEndpoint);
  }
}
