# Configuring for a new lab/organization

If you would like to use <SmileText/> in new lab/organization you need to configure a small set of services (Github, Firebase, Slack, and a webserver) to play well together.   This document walks you through the steps to configure a set up so that multiple users in a lab can share the same resources.  

Even if you are using Smile alone you still will need to configure these services the first time you develop an experiment.  However, afterwards you can run multiple experiments using the setup you configured once.

## Overview

Smile glues together several affordable or free web services in order to make developing and launching experiments relatively painless. 

- **Github** (required).  
The project relies heavily on Github for managing code and projects.  Github not only organizes versions of your code using `git` but also allows you to run scripts each time you make a change to the code that can upload the latest version of your project to the web. 

- **Google Firebase/Firestore** (required).  
Smile stores the data from your experiments in a [Google Firestore](https://firebase.google.com/docs/firestore) database.  Firestore is a robust schema-less database solution ideally suited for the web.  The cost is low for even fairly large experiments and datasets (although there are some technical limits, see [here](/datastorage) for more info). 

- **Slack** (weakly required).  
In order notify you and your other lab members when certain tasks are complete or if there are errors, Smile uses a slack bot.  You need to have a Slack account and get API keys to enable this.  If you don't want to use Slack it is possible to modify the scripts to provide notifications another way (e.g., email) but currently that is not implemented and you'd have to research that yourself.

- **A SSL signed HTTP/web server** (required).  
Finally, you need to provide a web hosting site to host your experiments.  The requirements of this website are quite simple, you just need a regular static HTTP server with a secure signed certification (SSL).  Many web hosting services provide this type of account, as well as many universities.  If you are looking for recommendations, <GureckisLabText/> uses Dreamhost.com which costs as little as $3/month for a single SSL hosted website.  This would cover all possible experiments you would want to run so the cost would never be much more than that.

The general overview of how these services interact is shown below:

![Overview of services](/images/service-overview.png)

Basically, you push code to Github.  Each time this happens your code is [deployed](/deploying) to your web (i.e., http) server.  In addition, a message is posted to slack to let you know if any errors occured while setting things up.  Participants access your task via their web-browser which is able to write to the Google Firebase database.  

The following sections walk you through configuring each of these services.  Remember that although this takes a few steps, it is a one-time set up and multiple projects, across multiple members of a lab can use the same infrastructure, mostly unaware of the details of this underlying configuration.


## Setup Github

The following steps walk you through setting up Github for use with Smile and introduce some basic concepts.
### Create accounts

Github acts as a hub for most things in Smile.  Each person in your lab needs to have a Github account (these are free).  In addition, it makes sense for your lab to create a Github organization (also known as [team](https://github.com/team)).  Github organizations are meta-accounts that multiple individuals can belong to granting them access to multiple private and public repositories.  

- First create a new organization, using the docs provided by Github [here](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/creating-a-new-organization-from-scratch).
- Next, optionally, you can use the [Github Education for Teachers](https://education.github.com/teachers) program to request a free "Team" level upgrade to your organization allowing you to use several useful and required Github services for free including [Github Actions](https://github.com/features/actions).  This might be preferred if you anticipate heavy useage of your organization's github page.  However, even the free level (called Github Free) works!
- Finally you can locate the organization in Github and [invite the members of your lab to be members of the organization](https://docs.github.com/en/organizations/managing-membership-in-your-organization/inviting-users-to-join-your-organization).


### Set up a "base" Smile repo for your organization/lab

Next you want to create a fork of the main smile Github repo for use in your organization.  A fork is a copy of all the code in a repository that can be then developed and changed independently of the parent.  However, you maintain a connection to the original repository so you can pull down and synchronize changes from the child and parent repositories when you want.
This new forked repo will be your lab's "base" repo.  All your individual projects will then fork from your lab's "base" repo.  This allows you to share the lab/organization-specific configuration files with all the repos that fork from your base repo.

![Inheriting between Github repos](/images/labconfig-github-inherit.png)

In the figure above, each node is a Github repository. Each lab (Hartley Lab, Lake Lab) forks from the base Smile repo and then student projects for that lab fork from the lab's base thus distributing the lab-specific configuration files.

To create this base repo, navigate to the main <SmileText/> repo [here](https://github.com/NYUCCL/smile/fork). 
A screenshot of this page should look like this:

![Forking the base repo](/images/labconfig-github-fork.png)


Be sure to make the owner of the account your **organization** rather than your personal Github account.  The name can be anything but `smile` works and the description is up to you.  Copy the main branch only is fine.

This will create a new repository that will look like this (assuming your organization was `hartleylabnyu`):

![Github overview](/images/labconfig-github-overview.png)


Next you should clone a local copy of this repo to your computer:

![Cloned repo](/images/labconfig-github-clone.png)



![Github commandline](/images/labconfig-github-clone-commandline.png)

The results is you will have a fresh copy of the Smile project files in a folder on your computer 

## Setup Firebase

Data storage and recording is provided using Firebase cloud services (specifically Firestore which is a
database service provided under the general Firebase sytem).  You need to create a Firebase account 
and then create a Firestore project.

First, go to https://console.firebase.google.com and create an account.  After your account is created, 
you are presented with a page that looks like this:

![Firebase create project](/images/labconfig-firebase-newproject-1.png)

Click create project and then choose a project name (can by anything, e.g., your lab/org name):
![Firebase new project](/images/labconfig-firebase-nameproject-2.png)

When you are asked about enabling analytics, it doesn't matter really what you decide.  Analytics might be able to give you
some statistical insight into who is using your experiments but again it isn't critical.

![Firebase enable analytics](/images/labconfig-firebase-analytics-3.png)

Next, go to the project page in the Firebase console and click add web app (the icon that looks like `<\>`):
![Firebase project overview](/images/labconfig-firebase-console-4.png)

Register the new web app giving it a nickname (something like `smile-db` might make sense but up to you).  
You do **not** need to also set up Firebase Hosting.

![Firebase add sdk](/images/labconfig-firebase-addwebapp-5.png)


Next, add the Firebase SDK (select `use npm`) making sure to copy the Firebase 
configuration keys that are shown as a chunk of javascript code lower on the page (highlight below) and 
saving them someplace safe as you will need these later:

![Firebase get credentials](/images/labconfig-firebase-credentials-6.png)




## Setup Slack

When your code is updated to the Github it goes through a pre-processing step which optimizes the speed at which the code 
is delievered to participants.  If this process fails it is helpful to get a notification.  Also when you code builds successfully it is deployed to a unique URL (see [deploy](/deploying) docs for full details).  It is also helpful to receive error messages when things go wrong.

**If you don't want to use Slack, skip these instructions and go to the next section.**

First from the side bar in Slack choose your organization name and select "Tools" from the dropdown menu, when "Workflow Builder".
You'll get a screen that looks like this:

![Slack config](/images/labconfig-slack.png)

Select the green "Create" button in the top right of the screen and choose a name for your workflow "smile deployment notifications"
is fine:
![Slack config](/images/labconfig-slack8.png)

Next select "Webhook" as the type of workflow you are creating.

![Slack config](/images/labconfig-slack2.png)

Click add variables and add the following three variables names to your workflow (`github_username`, `deploy_url`, and `github_hash`):

![Slack config](/images/labconfig-slack3.png)

Next, select the option to "Send a message" and select an appropriate channel (`#smile_deploy` is a nice way to segregate these
messages out for your lab).  Configure the message template to look something like this (you can use emojis for fun):

![Slack config](/images/labconfig-slack4.png)

Click save and you'll see your settings like this:
![Slack config](/images/labconfig-slack5.png)

You can make some changes here including making a custom icon for your bot, etc...
When you are happy with it, click publish and it will show you the URL for using this workflow:

![Slack config](/images/labconfig-slack6.png)

Be sure to copy the url down for later.


Next you need to repeat the process to create a separate workflow for errors.
Start over from the start of this section, creating a new workflow.  The name can be "smile deployment error", webhook is the type, the variables need to be `github_username` and `message`.
The message you send should look like this:

![Slack config](/images/labconfig-slack9.png)

Once again you can customize the icon and then click "Publish", copying down the URL for later.

## Setup a SSL signed HTTP/web server

Smile requires you to host your HTML files on a webserver with a SSL signed certificate (so that it loads using the `https://` prefix in a browser).
Many universities provide these (sometimes called web hosting accounts), and they are available cheaply from many internet service providers.
We use [Dreamhost](https://www.dreamhost.com) which is a very long standing internet hosting provided.  Their basic shared hosting plan can host
all of a lab's experiments for about $2/month: [Dreamhost shared hosting plans](https://www.dreamhost.com/hosting/shared/).

The main requirement is that you can SSH to the server and upload files that way. 

## Configure your base repo

Once you have all these services set up you need to configure your new base lab repo for use with your services.
The configuration files for your lab's base Smile install will be located in the `env/` folder.  In the initially
cloned version (see above) your listing in that folder will look like this:

```
.env
.env.deploy.local.secret
.env.docs.local.secret
.env.local.secret
```

You are going to first delete the files ending in `.secret`.  You will regenerate those secret files in a later step.

Next you need to create a file called `.env.local.secret` in the `env/` folder.
The content of that file should look like this:

```
# this file is not tracked by github and contains
# semi-sensitive information
# note these variables are complied in the final javascript
# source so don't add very high security stuff to them
#

# enter firebase database credentials
VITE_FIREBASE_APIKEY             = xxxx
VITE_FIREBASE_AUTHDOMAIN         = xxxx
VITE_FIREBASE_PROJECTID          = xxxx
VITE_FIREBASE_STORAGEBUCKET      = xxxx
VITE_FIREBASE_MESSAGINGSENDERID  = xxxx
VITE_FIREBASE_APPID              = xxxx

# enter google analytics id
VITE_GOOGLE_ANALYTICS            = xxxx

# configure your experiment here
VITE_BUG_REPORTS                 = ""
```


You will want to replace the values for the entires that contain the word `FIREBASE` with the corresponding
values you obtained above when setting up your Firebase (you should have copied them down but it is possible to 
look them up again on your Firebase project page).  The `VITE_GOOGLE_ANALYTICS` field can be empty or you can add
a Google analytics ID.  The `VITE_BUG_REPORTS` is an unimplemented feature currently and can be ignored.


Next, you need to create a file called `.env.deploy.local` in the `env/` folder.
The content of that file should look like this:

```
# this file is not tracked by github and contains
# sensitive information inluding write access to our experiment
# hosting web server!

# enter experiment hosting web server information here
EXP_DEPLOY_HOST        = "xxx"
EXP_DEPLOY_PATH        = "/home/user/exps"
EXP_DEPLOY_PORT        = 22
EXP_DEPLOY_USER        = xxx
SLACK_WEBHOOK_URL      = https://hooks.slack.com/workflows/xxx
SLACK_WEBHOOK_ERROR_URL= https://hooks.slack.com/workflows/xxx
EXP_DEPLOY_KEY         = "-----BEGIN RSA PRIVATE KEY-----\nxxx\n-----END RSA PRIVATE KEY-----"
```

The `EXP_DEPLOY_HOST` is the domain name of the http hosting service you set up above.  For example `www.psych.nyu.edu`.
The `EXP_DEPLOY_PATH` is the path to the folder on that server where you will upload you web files.
The `EXP_DEPLOY_PORT` should be 22 for ssh access unless something very special is configured on your hosting service.
The `EXP_DEPLOY_USER` should be the username of the account you use to access your http hosting service
The `SLACK_WEBHOOK_URL` is the URL you should have written code when setting up your slack workflows above.
The `SLACK_WEBHOOK_ERROR_URL` is the URL you should have written code when setting up your slack workflows above this
time for the error handling workflow.
Finally, `EXP_DEPLOY_KEY` should be the private SSH key you use to access your HTTP server using passwordless ssh.
Instructions on creating that key are provided [here for dreamhost](https://help.dreamhost.com/hc/en-us/articles/216499537-How-to-configure-passwordless-login-in-Mac-OS-X-and-Linux). The key needs to be all on one line with `\n` characters
when there are new lines and should include the part that says `BEGIN RSA PRIVATE KEY` as is visible above.  It should be very long though.


You can safely ignore the `.env.docs.local` file since the main docs are hosted by the main NYUCCL repo.

By default all of the `env/.env.*.local` files are ignored by github (using the `.gitignore` file).  This is because they have
sensitive information.  However you need to distribute those files out to people working in your lab.
To do that we instead will encrypt the files and store the encrypted files in your github account.  This works even for public
github repositories ensuring that your content is not visible to others.


## Encrypt your configuration files

The final step of setting up your lab's base Smile repo is to encrypt your environment files.
To do this you will use the well documented `git-secret` package ([here](https://sobolevn.me/git-secret/)).
First install git-secret package using Homebrew:

![Firebase project overview](/images/labconfig-gitsecret-brew.png)

Next, remove the `.gitsecret` folder in your base repo:

```
rm -rf .gitsecret
```

Next run:

```
git secret init
```

to reinitialize your gitsecret setup.

Next, create a `gpg` RSA key pair for yourself (e.g., lab manager/pi)
see [this](https://git-secret.io/#using-gpg) for more info but basically you just
type:

```
gpg --gen-key
```

Next, add the first user to your repo:

```
git secret tell you@email.com
```

(replacing you@email.com with your email address)

Next, add the files:  
```
git secret add .env/.env.deploy.local
git secret add .env/.env.local
git secret add .env/.env.docs.local
```

(TRhe last command about `.env.docs.local` is optional)

Finally, encrypt the files

```
git secret hide
```

Now commit everything that has changed to your github repo.

## Managing your organization

From this point forward, lab members in your group should just clone from your base repo
and they will get the correct configuration files.  They will have to run a set to decrypt
those files so you will manually add and remove accounts from your base repo.

### Adding additional users to your system

First, get the user's GPG key (see above on instructions for that).
Ask them to type (on mac):

```
gpg --armor --export their@email.id > pbcopy
```

and copy the public key to you in a email or slack.

Next, import the key into your keychain by copying it to your keyboard
then typing

```
pbpaste | gpg --import
```

Next this add to your keyring 
```
git secret tell their@email.id
```

Finally, re-encrypt the files: 
```
git secret reveal; git secret hide
```

### If you make changes to the env files for your project
- reencrypt the files 
```
git secret hide
```

- upload them to the github repo 
```
npm run upload_config
```

### Configure your git secrets on github

To configure the github repo correct:

```
gh auth login
``` 

if you haven't already

Then, upload the configuration settings
```
npm run upload_config
```


