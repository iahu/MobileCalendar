module.exports = '''
<div class="mobile-calendar-pane month-view">
	<div class="mobile-calendar-hd clearfix">
		<span class="ym">{{year}}/{{month}}</span>
		<a class="closer">&times;</a>
	</div>
	<table class="mobile-calendar-table mobile-calendar-ht">
		<tr>
			{{#each weekNames}}
			<td>{{.}}</td>
			{{/each}}
		</tr>
	</table>
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
	<div class="dot-g"><i class="dot"></i><i class="dot cur"></i><i class="dot"></i></div>
</div>''';