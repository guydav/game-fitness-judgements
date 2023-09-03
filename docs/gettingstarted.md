# :raising_hand: Getting started contributing

The <SmileText/> repo ([https://github.com/NYUCCL/smile](https://github.com/NYUCCL/smile)) includes both the code and documentation for the code.  The repo is private so you need to be added as a member of the <GureckisLabText/> lab organization (contact Todd and give him your GitHub username).

Next, follow the guide on [required software](/requirements).

The next step is to clone the project [github repo](https://github.com/NYUCCL/smile) and set
your current terminal to the working copy. Then, install the required javascript dependencies
using `npm`, the node package manager (similar to `pip` in python).  This can be accomplished with three simple commands in your terminal program (you can also clone the repo using GUI tools if you prefer):

```
git clone https://github.com/nyuccl/smile.git
cd smile
npm install
```

Once you have the packages installed you can use different commands to start the local development server for either the documentation website or the experiment project.



To start the experiment development server:

```
npm run dev
```

To start the documentation development server:

```
npm run docs:dev
```

Either of these commands will print out a URL that looks roughly like `http://localhost:3000/`. If you open this link in your favorite browser (or command-click the link on MacOS), it will load the respective website. 

Next steps: 
- Learn how to [contribute to the documentation](/contributing)
- Understand the [design principles](/principles)