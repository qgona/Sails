import { bootstrap } from 'angular2/platform/browser';
import { Component, Injectable, Inject } from 'angular2/core';
import { HTTP_PROVIDERS, Http, Request, Response } from 'angular2/http';
import 'rxjs/Rx';

interface TestVer {
}

interface Tracker {
}

@Injectable()
class TestVerService {
	constructor(private http: Http) {
	}

	fetch(): Observable<TestVer> {
		return this.http.get("/testver").map(res => res.json() as TestVer);
	}

	tracker(Value: String) {
		this.http.get('/tracker/' + Value)
			.map(res => res.json())
			.subscribe(
				(data) => {
					drawPieChart(data, 400, 400, "#graph, Value");
				},
				(err) => this.error = err
			); // Reach here if fails
	}
}

@Component({
	selector: 'testver',
	templateUrl: '/app/compornents/dropdownlist/component.html'
})

export class TestVerComponent {
	public data: TestVer;

	constructor(private service: TestVerService) {
	}

	ngOnInit() {
		this.service.fetch().subscribe(data => this.data = data);
	}

	onChange(event, Value) {
		this.service.tracker(Value);
	}
}

bootstrap(TestVerComponent, [HTTP_PROVIDERS, TestVerService]);