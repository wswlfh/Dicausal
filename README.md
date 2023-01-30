### Dicausal

We propose a causal discovery system called DiCausal, which allows users to apply their simple domain knowledge of how variables affect each other and then edit the graph during the causal discovery process interactively, without incurring too much burden. We experimentally demonstrate that such a way of incorporating domain knowledge into causal discovery algorithms can get better results compared with the pure data-driven methods.This project is the source code of *DiCausal: Exploiting Domain Knowledge for Interactive Causal Discovery*.This paper has been accepted by DASFAA 2023.

### Installing

##### Version

- Python 3.6 
- Node.js 10.0.13+
- Npm 8.6+
- Yarn 1.13+
- React.js 17.0.0+

##### Buliding

```
# install
$ git clone 
$ cd dicausal

# flask init
$ cd api
$ python3 -m venv venv
$ source venv/bin/activate
(venv) $ pip install flask python-dotenv

# frontend dev server:
$ npm install
$ yarn start

# backend dev server:
$ yarn start-api

```

This will take a few seconds and then a browser window will open with the example application from React loaded from *http://localhost:3000*:

### Getting Started

Go to the home page and you will see three panels on the left, middle and right.

The left panel is the various configuration items of the algorithm. First, upload the dataset you want to analyze. The format, template and other requirements of the dataset will be explained later. Here, we first recommend using the sample dataset doc/example.csv.

The middle panel is used for causal discovery and inference in the form of force-oriented diagram. You can complete this process faster according to the above prompts and in combination with your own domain knowledge.

The right panel shows a complete and comprehensive structural causal model diagram. You can generate expected results according to the operation of the middle panel

### Contribution

If you're new to contributing to Open Source on Github, [this guide](https://guides.github.com/activities/contributing-to-open-source/) can help you get started. Please check out the [contribution guide](https://github.com/covid19india/covid19india-react/blob/master/CONTRIBUTING.md) for more details on how issues and pull requests work.