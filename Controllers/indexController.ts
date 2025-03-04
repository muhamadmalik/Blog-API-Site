import { Article } from '@prisma/client';
import {
  addComment,
  createArticle,
  createTag,
  getArticle,
  getArticles,
  getLatestArticles,
  getTagArticles,
  getTags,
} from '../Models/articles';

export const getIndexData = async (req, res) => {
  try {
    const articles = await getArticles();
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getTaggedArticles = async (req, res) => {
  try {
    const tags = req.params.taqs;
    const articles = await getTagArticles(tags);
    res.json(articles);
    // await createTag({
    //   name: 'JavaScript',
    // });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getLatestArticlesData = async (req, res) => {
  try {
    const latestArticles = await getLatestArticles();
    res.json(latestArticles);
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getArticleContorller = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }

    const article = await getArticle(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addArticle = async (req, res) => {
  try {
    const { text, title, authorId, tags } = req.body;

    if (!text || !title || !authorId) {
      return res
        .status(400)
        .json({ error: 'Title, text, and authorId are required' });
    }

    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags should be an array' });
    }

    const newArticle = { text, title, authorId, tags };
    const article = await createArticle(newArticle);

    res.status(201).json({ message: 'Article created successfully', article });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const postComment = async (req, res) => {
  const { text, username, articleId } = req.body;
  const intArticleId = parseInt(articleId)
  const comment = { text, username, articleId: intArticleId };
  console.log(comment)

  try {
    if (!text || !username) {
      return res
        .status(400)
        .json({ error: 'text, articleId and authorId are required' });
    }
    const newComment = await addComment(comment);

    res
      .status(201)
      .json({ message: 'Comment added successsfully.', newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
