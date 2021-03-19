# project-gutenberg-slate-importer

A NodeJS script to add an eBook from [Project Gutenburg](https://www.gutenberg.org/) to [Slate](https://www.slate.host).


The script uses one of the Project Gutenburg mirrors to retrieve an eBook's HTML file.

1. eBook ID to fetch the file in the mirror's directory structure, <br>
e.g., eBook `#12345` is stored under `1/2/3/4/12345-h/12345-h.htm`

2. HTML eBook is converted to PDF using the Microlink API
3. PDF is uploaded to Slate
4. Book title, description, author and original source is updated on Slate
