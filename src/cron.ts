const path = require("path");
const cron = require('node-cron');
const fs = require("fs");
const nodemailer = require("nodemailer");
const http = require('http');
const url = require('url');

function scheduleReminders() {
    const tasksFilePath = path.join(__dirname, '..', '..', 'db', 'tasks.json');
    const transporter = nodemailer.createTransport({
        host: 'smtppro.zoho.in',
        port: 465,
        secure: true, //ssl
        auth: {
            user: 'reminders_xyz@zohomail.in',
            pass: 'unephPKxpjj1'
        }
    });
    cron.schedule('* * * * * *', () => {
        fs.readFile(tasksFilePath, 'utf8', (err: any, data: any) => {
            if (err) {
                console.error('Error reading tasks.json:', err);
                return;
            }

            let tasksJson;
            try {
                tasksJson = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing tasks.json:', parseError);
                return;
            }

            const now = new Date();
            tasksJson.tasks.forEach((task: any) => {
                const taskTime = new Date(task.createdAt);
                const [hours, minutes] = task.timeToRemind.split(':').map(Number);
                taskTime.setHours(hours, minutes, 0, 0);

                switch (task.reminderType) {
                    case 'second':
                        console.log(`Reminder for task: ${task.name}`);
                        break;
                    case 'minute':
                        if (now.getSeconds() === taskTime.getSeconds()) {
                            var mailOptions = {
                                from:'reminders_xyz@zohomail.in',
                                to: 'vaibhav.pandey0806@gmail.com',
                                subject: 'This is a test: test Minute reminder going',
                                text:'TgK'
                            }
                            console.log("Sending mail")
                            transporter.sendMail(mailOptions, function(error: any, info: any) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response)
                                }
                            })
                            console.log(`Reminder for task: ${task.name}`);
                        }
                        break;
                    case 'hourly':
                        if (now.getMinutes() === taskTime.getMinutes()) {
                            console.log(`Reminder for task: ${task.name}`);
                        }
                        break;
                    case 'daily':
                        if (now.getHours() === taskTime.getHours() && now.getMinutes() === taskTime.getMinutes()) {
                            console.log(`Reminder for task: ${task.name}`);
                        }
                        break;
                    case 'weekly':
                        if (now.getDay() === taskTime.getDay() && now.getHours() === taskTime.getHours() && now.getMinutes() === taskTime.getMinutes()) {
                            console.log(`Reminder for task: ${task.name}`);
                        }
                        break;
                    case 'monthly':
                        if (now.getDate() === taskTime.getDate() && now.getHours() === taskTime.getHours() && now.getMinutes() === taskTime.getMinutes()) {
                            console.log(`Reminder for task: ${task.name}`);
                        }
                        break;
                }
            });
        });
    });
}

scheduleReminders();