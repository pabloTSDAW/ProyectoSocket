import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../environments/environment';

@Injectable()
export class ServicioService {
    //private url = 'http://localhost:3000';
    private url = environment.serverSocket;
    private socket;

    constructor() {
        this.socket = io(this.url);
    }
}
