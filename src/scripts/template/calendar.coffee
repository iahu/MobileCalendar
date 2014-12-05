module.exports = '''<div class="mobile-calender">
	<div class="mobile-calender-hd">{{year}} / {{month}}</div>
	<table class="mobile-calender-table" id="mc-{{year}}-{{month}}" data-year="{{year}}" data-month="{{month}}">
		<thead>
			<tr>
				<th>日</th>
				<th>一</th>
				<th>二</th>
				<th>三</th>
				<th>四</th>
				<th>五</th>
				<th>六</th>
			</tr>
		</thead>
		{{#each months}}
			<tr>
				{{#each this}}
				<td data-date="d-{{this.date}}">
					<div class="cell"><span class="date">{{this.date}}</span></div>
				</td>
				{{/each}}
			</tr>
		{{/each}}
	</table>
</div>
''';