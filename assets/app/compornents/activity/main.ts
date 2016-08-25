import { bootstrap } from 'angular2/platform/browser';
import { Component, Injectable, Inject } from 'angular2/core';
import { HTTP_PROVIDERS, Http, Request, Response } from 'angular2/http';
import 'rxjs/Rx';

interface Activity {
}

@Injectable()
class ActivityService {
	constructor(private http: Http) {
	}

	fetch(): Observable<Activity> {
		return this.http.get("/activitylist")
				.map(res => res.json() as Activity);
	}
}

@Component({
	selector: 'activity',
	templateUrl: '/app/compornents/dropdownlist/component.html'
})

export class ActivityComponent {
	public data: Activity;

	constructor(private service: ActivityService) {
	}

	ngOnInit() {
		this.service.fetch().subscribe(data => this.data = data);
	}
}

bootstrap(ActivityComponent, [HTTP_PROVIDERS, ActivityService]);