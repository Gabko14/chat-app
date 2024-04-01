import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Message} from '../models/message';
import * as signalR from "@microsoft/signalr";
import {HubConnectionBuilder} from "@microsoft/signalr";

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private backendUrl = 'https://localhost:7150/';
  private userEndpoint = this.backendUrl + 'user';
  private roleEndpoint = this.backendUrl + 'roles';
  private messagesEndpoint = this.backendUrl + 'messages';
  private combinedMessagesEndpoint = this.backendUrl + 'combined';

  private hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) {}

  public startConnection = async (): Promise<void> => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7150/chathub') // Adjust the URL to match your server
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
