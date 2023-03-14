import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from './enumuaration/data.state.enum';
import { Status } from './enumuaration/status.enum';
import { AppState } from './interface/app.state';
import { CustomerResponse } from './interface/customer.response';
import { Server } from './interface/server';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    appState$: Observable<AppState<CustomerResponse>>
    readonly DataState = DataState;
    readonly Status = Status;
    private filterSubject = new BehaviorSubject<string>('')
    private dataSubject = new BehaviorSubject<CustomerResponse>(null)
    filterStatus$ = this.filterSubject.asObservable();
    private isLoading = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoading.asObservable();
    
  
  constructor(private _serverService: ServerService) {}

  ngOnInit(): void {
      this.appState$ = this._serverService.server$.pipe(
        map(response => {
          this.dataSubject.next(response)
          return { dataState: DataState.LOADED_STATE, appData: {...response, data: { servers: response.data.servers.reverse() }} }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      )
  }

  pingServer(ipAddress: string) : void {
    this.filterSubject.next(ipAddress)
    this.appState$ = this._serverService.ping$(ipAddress).pipe(
      map(response => {
        this.dataSubject.value.data.servers[
          this.dataSubject.value.data.servers.findIndex(server => 
            server.id === response.data.server.id
          )
        ] = response.data.server;
        this.filterSubject.next('')
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.filterSubject.next('')
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    )
  }

  filterServers(status: Status): void {
    this.appState$ = this._serverService.filter$(status, this.dataSubject.value).pipe(
      map(response => {
        return { dataState: DataState.LOADED_STATE, appData: response  }
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error : string) => {
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    )
  }
  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true)
    this.appState$ = this._serverService.save$(serverForm.value as Server).pipe(
      map(response => {
        this.dataSubject.next({
          ...response, data: { servers: [response.data.server, ...this.dataSubject.value.data.servers] }
        }),
        document.getElementById('closeModal').click();
        this.isLoading.next(false)
        serverForm.resetForm({ status: this.Status.SERVER_DAWN });
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.isLoading.next(false);
        return of({ dataState: DataState.ERROR_STATE, error });
      })
    );
  }

  deleteServer(server: Server): void {
    this.appState$ = this._serverService.delete$(server.id).pipe(
      map(response => {
        this.dataSubject.next({
          ...response, data: {
            servers: this.dataSubject.value.data.servers.filter(s => s.id !== server.id)
          }
        });
        return {
          dataState: DataState.LOADED_STATE, appData: this.dataSubject.value
        }
      }),
      startWith({ 
        dataState: DataState.LOADED_STATE, appData: this.dataSubject.value
       }),
       catchError((error: string) => {
        return of({
          dataState: DataState.ERROR_STATE, error
        })
       })
    );
  }

  printReport(): void {
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'server-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  printReportpdf(): void {
    window.print();
  }
}
