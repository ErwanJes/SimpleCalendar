SimpleCalendar
==============

Simple Calendar for jQuery

I needed an calendar easy to modify and to update. Unfortunately none on the current market could do what I wanted to.
So i created my own. It is still under development, so do not hesitate to contact me if a problem appears or if you need to arrange it.


How it is work
-----------

A day is a DOM object "li". All events are "ul".
It may be possible to use other DOM objects, but i can't guarantee it will works.

Install
-----------

You simply have to had this in your javascript :

	$("#myCalendar").simplecalendar();


Options
-----------

By default, it is in French.

Possible options : 

<li>
	<b>monthNames</b>  monthNames: ['January','February','March','April','May','June','Juillet','August','September','October','November','December']
</li>
<li>
	<b>dayNames</b> ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
</li>
<li>
	<b>numberOfDayShown</b>  3 // number of day shown
</li>
<li>
	<b>next</b> loadNextEvent // function called when the user go to a next date (right arrow)
</li>
<li>
	<b>prev</b> loadPrevEvent // function called when the user go to a previous date (left arrow)
</li>



	function loadNextEvent(date)
	{
		// load next event for date
	}


To used it, add it in the constructor like this :

	$("#myCalendar").simplecalendar({monthNames})



I'll try to post a tutorial to explain it in detail.


Demo
-----------

There is a [demo include with this project.](./SimpleCalendar/tree/master/demo)


License
-----------

Under MIT-LICENSE (see [MIT-LICENSE.txt](./SimpleCalendar/blob/master/MIT-LICENSE.txt))