module.exports = '''
<div class="mobile-calender-pane">
	{{#if yearView}}
		<div class="mobile-calender-yhd">{{monthName}}</div>
	{{else}}
		<div class="mobile-calender-hd">
			{{year}}/{{month}}
		</div>
		<table class="mobile-calender-table mobile-calender-ht">
			<tr>
				{{#each weekNames}}
				<td>{{.}}</td>
				{{/each}}
			</tr>
		</table>
	{{/if}}
	<table class="mobile-calender-table mobile-calender-bt" id="mc-{{year}}-{{month}}">
		{{#each dates}}
			<tr>
				{{#each this}}
				<td class="{{cls}}" data-date="{{this.year}}-{{this.month}}-{{this.date}}">
					<div class="cell">
						<span class="date">{{this.date}}</span>
					</div>
				</td>
				{{/each}}
			</tr>
		{{/each}}
	</table>
</div>''';