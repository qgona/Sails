import { bootstrap } from 'angular2/platform/browser';
import { Component, Injectable, Inject } from 'angular2/core';
import { HTTP_PROVIDERS, Http, Request, Response } from 'angular2/http';
import 'rxjs/Rx';

interface Member {
}

@Injectable()
class MemberService {
	constructor(private http: Http) {
	}

	fetch(): Observable<Member> {
		return this.http.get("/member").map(res => res.json() as Member);
	}
}

@Component({
	selector: 'member',
	templateUrl: 'app/compornents/dropdownlist/component.html'
})

export class MemberComponent {
	public data: Member;

	constructor(private service: MemberService) {
	}

	ngOnInit() {
		this.service.fetch().subscribe(data => this.data = data);
	}
}

bootstrap(MemberComponent, [HTTP_PROVIDERS, MemberService])
    .then(success => console.log(`Bootstrap success`))
    .catch(error => console.log(error));