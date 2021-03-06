import React,  { useState, useEffect }  from "react";
import { Typography } from '@material-ui/core';
import wordsToNumbers from 'word-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';

import logo from './images/Logo.png';
import { NewsCards, Modal } from './components';
import useStyles from './styles';

const alanKey= 'YOUR API_KEY'

const App = () => {
    const [activeArticle, setActiveArticle] = useState(0);
    const [newsArticles, setNewsArticles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
  
    const classes = useStyles();
    useEffect(() => {
        alanBtn({
            key: alanKey,   
            onCommand: ({ command, articles, number }) => {
                if (command === 'newHeadlines') {
                  setNewsArticles(articles);
                  setActiveArticle(-1);
                }  else if (command === 'instructions') {
                    setIsOpen(true);
                  } else if (command === 'highlight') {
                    setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
                  } else if (command === 'open') {
                    const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
                    const article = articles[parsedNumber - 1];
                     if (parsedNumber > articles.length) {
                        alanBtn().playText('Please try that again...');
                      } else if (article) {
                        window.open(article.url, '_blank');
                        alanBtn().playText('Opening...');
                      } else {
                        alanBtn().playText('Please try that again...');
                  }
                }
            },
        })
    }, []);
    return (
        <div>
          <div className={classes.logoContainer}>
            {newsArticles.length ? (
              <div className={classes.infoContainer}>
                <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
                <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
              </div>
            ) : null}
            <img src="https://thumbs.dreamstime.com/b/artificial-intelligence-concept-circuit-board-background-ai-logo-vector-illustration-175673615.jpg" className={classes.alanLogo} alt="logo" />
          </div>
          <NewsCards articles={newsArticles} activeArticle={activeArticle} />
          <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
          {!newsArticles.length ? (
            <div className={classes.footer}>
              <Typography variant="body1" component="h2">
                Created by
                <a className={classes.link} href="https://www.linkedin.com/in/muhammad-alkindy-b36a18134/"> Muhammad Alkindy</a> -
                <a className={classes.link} href="https://buiano_port.netlify.app">Portfolio</a>
              </Typography>
              <img className={classes.image} src={logo} height="50px" alt="Buiano logo" />
            </div>
          ) : null}
        </div>
      );
    };

export default App;

