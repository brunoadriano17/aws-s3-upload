## Steps
### This is an example for pushing files to S3 with Node and Typescript
#### With this code you are able to generate private links with expiration for retrieving S3 files and to upload new files
* Install dependencies
    * <i>yarn</i>
* Setup AWS
    * For key/secret setup your local aws sdk
    * Bucket and region should be set on .env
* Run server
    * <i>yarn dev</i>
* POST /upload</br>
    * Request: 
``curl --location 'http://localhost:3000/upload' --form 'file=@"/path/to/file"'
``
    * Response: ``{
    "message": "Upload realizado com sucesso",
    "key": "df49a060-0313-4fc2-8543-c0999eb2d58a.png"
}``
* GET /:key
    * Request: ``curl --location 'http://localhost:3000/df49a060-0313-4fc2-8543-c0999eb2d58a.png'``