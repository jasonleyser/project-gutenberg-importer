# project-gutenberg-slate-importer

A NodeJS script to add an eBook from [Project Gutenburg](https://www.gutenberg.org/) to [Slate](https://www.slate.host).


The script uses one of the Project Gutenburg mirrors to retrieve an eBook's HTML file.

1. eBook ID to fetch the file in the mirror's directory structure. <br>
For example, eBook `#12345` is stored under `1/2/3/4/12345-h/12345-h.htm`

2. HTML eBook is converted to PDF using the Microlink API
3. PDF is uploaded to Slate
4. The book's title, description, author and original source is updated on Slate

## Setting up the Cronjob

1. Fork or clone this repo 
2. Create a new Cron Job on [render.com](https://www.render.com/), and deploy this repo
3. In the settings, make sure these fields are set to:<br> 
Build command: `npm install`<br>
Command: `npm run start`<br>
<img width="1093" alt="Screen Shot 2021-03-19 at 9 18 55 AM" src="https://user-images.githubusercontent.com/60402678/111802911-24457080-8894-11eb-8947-595b1296cedf.png">

4. Set the schedule time to how often you want the script to run. <br><br>
For example:<br>
`*/5 * * * *` will run every 5 minutes<br />
`0 0 8 1/1 * ? *` will run once a day at 8:00am

5. Create two ENV variables called:
`API_KEY`
`SLATE_ID`


