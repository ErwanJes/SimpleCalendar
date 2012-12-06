/**
 * SimpleCalendar v0.1
 *
 * Copyright (c) 2012 Erwan Jestin
 * Licensed under the MIT located in MIT-LICENSE.txt.
 *
 * Date: Tue Nov 26
 *
 */
(function($) {
	var defaults = {
		numberOfDayShown:3,
				
		monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
		dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
	}
	
	$.fn.simplecalendar = function(params) {
		params = $.extend(defaults, params);
		
		// dates array
		var datesShown = new Array();
		
		// get today date (month & day)
		var today = new Date();
		var todayMonthId = today.getMonth();
		var todayDayId = today.getUTCDate();
		var currentMiddleDay = today;
		
		// create container of simplecal title
		var title = 
			"<div id='simplecal_title'>"+
				"<h1 id='simplecal_title_text'>"+
				"</h1>"+
			"</div>";
		this.append(title);
		
		// add arrows
		var arrowImgLeft = "<img id='simplecal_arrow_left' src='../simplecalendar/images/arrowLeft.png' alt='Left' height='60px' width='60px' />";
		this.append(arrowImgLeft);		
		
		var arrowImgRight = "<img id='simplecal_arrow_right' src='../simplecalendar/images/arrowRight.png' alt='Right' height='60px' width='60px' />";
		this.append(arrowImgRight);
		
		// add arrow clic event
		$("#simplecal_arrow_left").click({isDayAfterToday: -1}, moveDaysLine);
		$("#simplecal_arrow_right").click({isDayAfterToday: 1}, moveDaysLine);
		
		// set text of simplecal title
		if (todayMonthId <= params.monthNames.length)
		{
			$("#simplecal_title_text").text(params.monthNames[todayMonthId]);
		}
		
		// calculate the width of each day container
		var totalWitdh = $("#simplecal_title").width();
		var dayWidth = (totalWitdh / params.numberOfDayShown);
		
		// add the line of the days
		var daysLine = "<div id='simplecal_days'></div>";
		this.append(daysLine);
		
		// add the container of events
		var eventList = "<div id='simplecal_event_list'></div>";
		this.append(eventList);
		
		// set width for days line
		var simpleCalDays = $("#simplecal_days");
		simpleCalDays.width(totalWitdh);
		
		// set width for events container
		var simpleEventList = $("#simplecal_event_list");
		simpleEventList.width(totalWitdh);
		
		// get today id in list
		var todayNumber = Math.ceil(params.numberOfDayShown / 2);
		
		var lastDate = new Date(today.getTime());
		lastDate.setDate(lastDate.getDate() + (todayNumber - 1));
		
		var firstDate = new Date(today.getTime());
		firstDate.setDate(firstDate.getDate() - (todayNumber - 1));
		
		var todayId = 0;
		if (todayNumber > 0)
		{
			todayId = todayNumber - 1;
		}
		else
		{
			todayId = todayNumber;
		}
		
		var firstCalDate;
		
		showDays();
		
		function showDays(idFirstDay)
		{
			var daysDiv;
			var daysNumberOfMonth;
			
			if (idFirstDay != undefined)
			{
				currentMiddleDay.setDate(currentMiddleDay.getDate() + idFirstDay);
				todayId +=idFirstDay;
			}

			// get & show days header
			for (i=0; i< params.numberOfDayShown; i++) {
				if (i < todayId)
				{
					daysNumberOfMonth = todayDayId - (todayId - i);
				}
				else if (i == todayId)
				{
					daysNumberOfMonth = todayDayId;
				}
				else if (i > todayId)
				{
					daysNumberOfMonth = todayDayId + (i - todayId);
				}
			
				var d = new Date(today.getFullYear(), today.getMonth(), daysNumberOfMonth, 0, 0, 0, 0);
				datesShown[i] = getRealDate(d, 0);			
			
				if (todayId == i)
				{
					daysDiv = 
					"<div class='simplecal_days_"+i+" simplecal_dayLine_day simplecal_today'>"+
						"<h2>"+datesShown[i].getDate()+"</h2>"+
					"</div>"; 
				}
				else
				{
					daysDiv = 
						"<div class='simplecal_days_"+i+" simplecal_dayLine_day'>"+
							"<h2>"+datesShown[i].getDate()+"</h2>"+
						"</div>"; 
				}
				// append to DOM
				$("#simplecal_days").append(daysDiv);
			}
		
			// set width per day
			$(".simplecal_dayLine_day").width(dayWidth+"px");
		
			// show list of event inside calendar
			if (datesShown)
			{
				var currentDateInDom, domElement;
				var marginLeft = 0;
				for (i=0; i< datesShown.length; i++)
				{
					// dateformat : MMddyyyy
					domElement = getDOMName(datesShown[i]);
				
					if (domElement.length > 0)
					{
						if (!firstCalDate)
						{
							firstCalDate = domElement;
						}
						
						createDOMElement(domElement)
					}
				}
			}		
		}
		
		function createDOMElement(domElement, isBefore)
		{
			if (isBefore)
			{
				simpleEventList.prepend(domElement);
			}
			else
			{
				simpleEventList.append(domElement);
			}
			domElement.removeClass("simplecal");
			domElement.addClass("simplecal_day_event_list");
			domElement.width(dayWidth - 5 +"px");
			$(".simplecal_day_event_list li").hover(listItemEventHoverIn, listItemEventHoverOut);
		}
		
		function getDOMName(date)
		{
			return $(".simplecal_"+(date.getMonth() +1) + "" + date.getDate()  + "" + date.getFullYear());
		}
		
		function getDOMString(date)
		{
			return "simplecal_"+(date.getMonth() +1) + "" + date.getDate()  + "" + date.getFullYear();
		}
		
		function moveDaysLine(event)
		{			
			var domElement, oldDayDate;
			var newDate = today;
			var isBefore = false;
			// get old DOM element
			if (event.data.isDayAfterToday > 0)
			{
				// next
				// keep a reference
				oldDayDate = new Date(lastDate.getTime());
				
				lastDate = getRealDate(lastDate, event.data.isDayAfterToday);
								
				// remove old date
				var oldDate = getDOMName(firstDate);
				$(oldDate).addClass("simplecal");
				
				// update right date
				firstDate.setDate(firstDate.getDate() + event.data.isDayAfterToday);
				
				// add new date
				domElement = getDOMName(lastDate);
				
				newDate = lastDate;
				
				// fire custom function
				if (params.next)
				{
					params.next(newDate);
				}
			}
			else
			{
				// previous
				// keep a reference
				oldDayDate = new Date(firstDate.getTime());
				
				firstDate = getRealDate(firstDate, event.data.isDayAfterToday);
				
				isBefore = true;
				
				// remove old date
				var oldDate = getDOMName(lastDate);
				$(oldDate).addClass("simplecal");
				
				// update right date
				lastDate.setDate(lastDate.getDate() + event.data.isDayAfterToday);
				
				// add new date
				domElement = getDOMName(firstDate);
				
				newDate = firstDate;				
			
				// fire custom function
				if (params.prev)
				{
					params.prev(newDate);
				}
			}			
			
			//var isEmpty;
			if (domElement.length > 0)
			{
				createDOMElement(domElement, isBefore);				
				if (isBefore)
				{	
					firstCalDate = domElement;
				}
			}
			else
			{
				if (firstCalDate && isBefore)
				{
					// add empty element
					var newDOMElement = getDOMString(firstDate);
					var emptyEvent = "<ul class='simplecal " + newDOMElement + "'><li style='border:0; box-shadow: none; cursor:auto'></li></ul>";
					$("#simplecal_event_list").append(emptyEvent);
					
					
					//this.add(emptyEvent);
					createDOMElement($("." +newDOMElement), true);
				}
			}
				
			// update days line
			var tempDate = new Date(oldDayDate.getTime());		
			for (i=0; i< params.numberOfDayShown; i++) {
				var title = $(".simplecal_days_"+i+ " > h2");
				
				
				if (!isBefore)
				{
					tempDate = getRealDate(tempDate, - (params.numberOfDayShown + i - 1));
				}
				else
				{
					tempDate = getRealDate(tempDate, i);
				}
				
				var day = parseInt(title.text());
				var dateOfDay = new Date(tempDate.getFullYear(), tempDate.getMonth(), day, 0, 0, 0, 0);
				dateOfDay = getRealDate(dateOfDay, event.data.isDayAfterToday);
				title.text(dateOfDay.getDate());
				
				// update month label
				if (i == (todayNumber - 1) && (dateOfDay.getDate() == 1 || dateOfDay.getDate() == daysInMonth(dateOfDay.getMonth()+1, dateOfDay.getFullYear())))
				{					
					$("#simplecal_title_text").text(params.monthNames[dateOfDay.getMonth()]);
				}
			}
		}
		
		function getRealDate(date, incrementDay)
		{
			var tempDate = new Date(date.getTime());
			if (incrementDay < 0)
			{			
				if (tempDate.getDate() == 1)
				{
					var month = tempDate.getMonth();
					if (month ==0)
					{
						month = 11;
						tempDate.setFullYear(tempDate.getFullYear() - 1);
						tempDate.setMonth(month);
					}
					else
					{
						month -= 1;
						tempDate.setMonth(month);
					}
					tempDate.setDate(daysInMonth(month + 1, date.getFullYear()));
				}
				else
				{
					tempDate.setDate(date.getDate() + incrementDay);
				}
			}
			else
			{
				if ((tempDate + incrementDay) > daysInMonth(tempDate.getMonth() +1, tempDate.getFullYear()))
				{
					if (tempDate.getMonth() == 11)
					{
						tempDate.setFullYear(tempDate.getFullYear() + 1);
						tempDate.setMonth(0);
						tempDate.setDate(incrementDay);
					}
					else
					{					
						tempDate.setMonth(tempDate.getMonth() + 1);
						tempDate.setDate(incrementDay);
					}
				}
				else
				{
					tempDate.setDate(date.getDate() + incrementDay);	
				}
			}
			return tempDate;
		}
		
		function daysInMonth (month,year) {
    		return new Date(year, month, 0).getDate();
    	}
		
		
		function listItemEventHoverIn(){
			$(this).animate({
    				height: '200px',
  				},
  				200,
  				function() {
  				}
  			);
  			
			$(this).children().animate({
    				height: '200px',
  				},
  				200,
  				function() {
  				}
  			);
		};
		
		function listItemEventHoverOut(){
			$(this).animate({
    				height: '45px'
  				},
  				200,
  				function() {
  				}
  			); 			
  			
			$(this).children().animate({
    				height: '45px',
  				},
  				200,
  				function() {
  				}
  			);
		};
		
		
		return this;
	};

})(jQuery);