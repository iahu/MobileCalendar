module.exports = '''
	{{#if yearView}}
	<div class="mobile-calendar-pane">
		<div class="mobile-calendar-yhd">{{monthName}}</div>
	{{else}}
	<div class="mobile-calendar-pane month-view">
		<div class="mobile-calendar-hd">
			{{year}}/{{month}}
		</div>
		<table class="mobile-calendar-table mobile-calendar-ht">
			<tr>
				{{#each weekNames}}
				<td>{{.}}</td>
				{{/each}}
			</tr>
		</table>
	{{/if}}
	<table class="mobile-calendar-table mobile-calendar-bt" id="mc-{{year}}-{{month}}">
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