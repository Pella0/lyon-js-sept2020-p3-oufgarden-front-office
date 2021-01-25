/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import Select from 'react-select';
import {
  getCollection,
  makeEntityDeleter,
  makeEntityAdder,
} from '../services/API';
import './style/Feed.scss';

const Feed = () => {
  const [articles, setArticles] = useState([]);
  const [articlesFiltered, setArticlesFiltered] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    getCollection('articles').then((elem) => {
      setArticles(elem);
    });
  }, []);

  const articleOption = articles.map((elem) => {
    return {
      value: elem.id,
      label: `${elem.title}`,
    };
  });

  const handleSelectArticleChange = (elem) => {
    if (!elem) {
      setArticlesFiltered([]);
    } else {
      setArticlesFiltered(elem.map((e) => e.value));
    }
  };

  useEffect(() => {
    getCollection('tags').then((data) => setAllTags(data));
  }, []);

  useEffect(() => {
    getCollection('tagToArticle').then((result) => {
      const articleToFilter = result
        .filter((article) => {
          if (tagList.includes(article.tag_id)) {
            return true;
          }
          return false;
        })
        .map((article) => {
          return article.article_id;
        });
      setArticlesFiltered(articleToFilter);
    });
  }, [tagList]);

  const handleTagList = (target) => {
    if (tagList.includes(+target.id)) {
      const newTagList = tagList.filter((item) => item !== +target.id);
      setTagList(newTagList);
    } else {
      setTagList((prevState) => [...prevState, +target.id]);
    }
  };

  const handleFavorite = () => {
    if (articles.id !== favorite) {
      makeEntityAdder('favorite', articles.id).then((result) => {
        setFavorite(result.favorite === true);
      });
    } else {
      makeEntityDeleter('favorite', articles.id).then((result) => {
        setFavorite(result.favorite === false);
      });
    }
  };

  return (
    <div className="containerFeed">
      <div className="searchArticleSelect">
        <Select
          isMulti
          name="articles"
          placeholder="rechercher votre articles"
          options={articleOption}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(e) => {
            handleSelectArticleChange(e);
          }}
        />
      </div>
      <div className="filterContainer">
        <button type="button" className="buttonPres">
          {favorite &&
            favorite.map((art) => {
              return (
                <div key={art.id} className="articlesRow" favorite={false}>
                  <div className="articlesInfos">
                    <img className="imgArticle" src={art.url} alt="jardin" />
                    <div className="text">
                      {ReactHtmlParser(articles.title)}
                    </div>
                  </div>
                </div>
              );
            })}
        </button>
        {allTags &&
          allTags.map((tag) => {
            return (
              <div key={tag.id}>
                <button
                  type="button"
                  className="filterButton"
                  id={tag.id}
                  onClick={(e) => handleTagList(e.target)}
                >
                  {tag.name}
                </button>
              </div>
            );
          })}
      </div>
      <div className="articleListContainer">
        {articlesFiltered.length > 0
          ? articles
              .filter((article) => {
                if (articlesFiltered.includes(article.id)) {
                  return true;
                }
                return false;
              })
              .map((e) => {
                return (
                  <div key={e.id} className="articlesRow" favorite={false}>
                    <Link to={`/articles/${e.id}`}>
                      <div className="articlesInfos">
                        <img
                          className="imgArticle"
                          src={`http://localhost:5000/${e.url}`}
                          alt="jardin"
                        />
                        <div className="text">{e.title}</div>
                      </div>
                    </Link>
                  </div>
                );
              })
          : articles.map((e) => {
              return (
                <div key={e.id} className="articlesRow">
                  <Link
                    className="Link-to-articleDetails"
                    to={`/articles/${e.id}`}
                  >
                    <div className="articlesInfos">
                      <div
                        className="likeButton"
                        onClick={() => {
                          handleFavorite();
                        }}
                        onKeyPress={() => {
                          handleFavorite();
                        }}
                        role="button"
                        tabIndex={0}
                        favorite={false}
                      >
                        {/* ♥ */}
                      </div>
                      <img
                        className="imgArticle"
                        src={`http://localhost:5000/${e.url}`}
                        alt="jardin"
                      />
                      <div className="text">{e.title}</div>
                    </div>
                  </Link>
                </div>
              );
            })}
      </div>
    </div>
  );
};
export default Feed;
