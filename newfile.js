const fs = require("fs")
const { mkdir } = require("fs/promises")
const path = require("path")

let
	desiredPath = process.argv[2],
	desiredTitle = desiredPath.slice(14),
	yearSlice = desiredPath.slice(6, 10),
	monthSlice = desiredPath.slice(11, 13)

desiredTitle = desiredTitle.replaceAll('-', ' ')
desiredTitle = desiredTitle.replaceAll('.md', '')

function toSentenceCase(str){
	return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1)
}
// https://javascriptf1.com/snippet/convert-a-string-to-sentence-case-in-javascript

desiredTitle = toSentenceCase(desiredTitle)

/*
	==========================
	start of time stuff adapted slightly from
	https://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes
*/

let
	timezone_offset_min = new Date().getTimezoneOffset(),
	offset_hrs = parseInt(Math.abs(timezone_offset_min/60)),
	offset_min = Math.abs(timezone_offset_min%60),
	timezone_standard

if(offset_hrs < 10) {
	offset_hrs = '0' + offset_hrs
}

if(offset_min < 10) {
	offset_min = '0' + offset_min
}

// Add an opposite sign to the offset
// If offset is 0, it means timezone is UTC
if(timezone_offset_min < 0) {
	timezone_standard = '+' + offset_hrs + ':' + offset_min
} else if(timezone_offset_min > 0) {
	timezone_standard = '-' + offset_hrs + ':' + offset_min
} else if(timezone_offset_min == 0) {
	timezone_standard = 'Z'
}

let
	dt = new Date(),
	current_date = dt.getDate(),
	current_month = dt.getMonth() + 1,
	current_year = dt.getFullYear(),
	current_hrs = dt.getHours(),
	current_mins = dt.getMinutes(),
	current_secs = dt.getSeconds(),
	current_datetime

// Leading zeroes
current_date = current_date < 10
	? '0' + current_date
	: current_date
current_month = current_month < 10
	? '0' + current_month
	: current_month
current_hrs = current_hrs < 10
	? '0' + current_hrs
	: current_hrs
current_mins = current_mins < 10
	? '0' + current_mins
	: current_mins
current_secs = current_secs < 10
	? '0' + current_secs
	: current_secs

// Current date/time - string such as 2016-07-16T19:20:30
current_datetime = current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs

let timeStamp = current_datetime + timezone_standard

/*
	end of time stuff adapted slightly from
	https://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes
	==========================
*/

let fileContents = `---
title: "${desiredTitle}"
description: "DESCRIPTION TO COME."
author: Bryce Wray
date: ${timeStamp}
draft: true
# initTextEditor: iA Writer # default --- change if needed
---

Text begins here.

<!--more-->
`

let outputPath = path.join(__dirname, 'src/', desiredPath)

const createFolder = async (path) => {
	try {
		if (!fs.existsSync(path)) {
			await mkdir(path, {
				recursive: true,
			})
			console.log('Folder created successfully')
		} else {
			console.log('Folder already exists')
		}
		fs.writeFile(outputPath, fileContents, function (err) {
			if (err) {
				return console.log(err)
			}
			console.log(outputPath + ' - file generated')
		})
	} catch (error) {
			console.log(error)
	}
}

let createPath = __dirname + '/src/posts/' + yearSlice + '/' + monthSlice

createFolder(createPath)
// https://www.webmound.com/nodejs-create-directory-recursively/
