# :woman_teacher: Presentation Mode

Presentation mode is a way of deploying <SmileText /> experiments in a way that they can be used to share examples of an experiment with other people. This can be helpful in cases where you want to share a link to your experiment with readers of a paper, collaborators, or others. You can also use this mode to develop richer, interactive views of the data in your experiment as well as complete websites devoted to a paper or project. A good example of an <SmileText /> experiment being shared in presentation mode is [here](https://exps.gureckislab.org/e/telephone-gleaming-kill/#/).

There are two things that presentation mode enables:

1. A colorful "landing page" that you can customize to show links to preprints/published articles, figures, and also links that let you jump between various parts of your experiment
2. It disables the control on which page/route of the experiment is shown in which order allowing you and your audience to jump around and explore different parts of the task (e.g., jump to read the instructions without first completing the consent form)

## How to use Presentation Mode

To run the default experiment in developer mode run

```
npm run dev:present
```

This will launch a website that looks something like this:

![Presentation Mode](/images/presentmode.png)

Notice that you can use the drop down "jump" menu to jump around between the parts of your experiment in this mode.

## How to customize Presentation Mode

To customize this presentation mode page edit the `src/components/presentation_mode/PresentationModeHomePage.vue` component. You can add
links to papers, hot link to different parts of your experiment, or add custom routes that help to visualize your data, etc...

## How to deploy in Presentation Mode

To deploy your project in presentation mode there are two options. The first is to create a new branch titled 'presentation'
and push this to GitHub. This will generate a special "presentation mode" deployment and you'll receive a slack notification
about when the website is ready. An example from the default <SmileText/> repo is [here](https://exps.gureckislab.org/nyuccl/smile/presentation/#/)

The second option is to edit `src/config.js` and change the line that reads

```
mode: import.meta.env.MODE,
```

to

```
mode: 'presentation',
```

When you next commit this change to your repo, the new site will be built in presentation mode. This can be done on any
branch.

### Notes

The `/config` route is not reachable in presentation mode by default to prevent certain information being leaked publically on your website.
