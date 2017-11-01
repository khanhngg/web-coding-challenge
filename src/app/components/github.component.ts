import { Component } from '@angular/core';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'github',
  templateUrl: './github.component.html',
  providers: [GithubService]
})
export class GithubComponent  {
  user:any;
  followers:any;
  username:string;
  count:number=0;

  constructor(private _githubService:GithubService){
    console.log('Github Component init');

  }

  search(){
    //console.log(this.username);
    this._githubService.updateUsername(this.username);
    this._githubService.getUser().subscribe(user => {
      //console.log(user);
      this.user = user;
    });

    this._githubService.getFollowers().subscribe(followers => {
      //console.log(followers);
      this.followers = followers;
    });
  }

  searchNextLoad(){
    this._githubService.updateCount();
    this._githubService.getNextFollowers().subscribe(followers => {
      //console.log(followers);
      this.followers = followers;
    });
  }

}
