/**
 * Blog Posts Controller
 * handles every blog related task
 */

// importing services
import dotenv from 'dotenv';
import models from '../models';
// import {
//   sendMessage,
//   emailTemplate
// } from '../utils';
import paginate from '../utils/paginate';

dotenv.config();

/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
function getRandomInt(maxLimit = 10, maxLength = 4) {
  const pool = [...Array(maxLimit).keys()];
  let result = [];

  while (result.length < maxLength) {
    const index = Math.floor(Math.random() * pool.length);
    result = result.concat(pool.splice(index, 1));
  }

  return result;
}

export const posts = {
  /**
   * create - create a single post
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  create(req, res) {
    const {
      title,
      desc,
      published,
      content,
      thumbnailUrl,
      categories
    } = req.body;
    const userId = req.authToken.id;
    const publishedAt = published === 'true' ? new Date() : null;
    const categoriesArray = categories.split(',').map(Number) || [1];

    models.Posts
      .create({
        title: title.trim(),
        desc,
        content,
        authorId: userId,
        publishedAt,
        thumbnailUrl: (thumbnailUrl || 'https://res.cloudinary.com/digr7ls7o/image/upload/v1516455539/no-img_hdhkpi.png')
      })
      .then((newPost) => {
        models.Categories
          .findAll({
            where: { id: [...categoriesArray] }
          })
          .then((foundCats) => {
            newPost.addCategories([...foundCats.map(foundCat => foundCat.id)]);
            // response on successful creation of post & association of category
            return res.status(201).json({
              newPost
            });
          })
          .catch((err) => {
            // no category found errors
            if (err) {
              err = {
                error: {
                  message: 'No category Found'
                }
              };
              return res.status(500).json(err);
            }
          });
      })
      .catch((err) => {
        // handle errors on post create
        if (err) {
          err = {
            error: {
              message: err.errors[0].message
            }
          };
          return res.status(500).json(err);
        }
      });
  },

  /**
   * edit - edit a single post
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  edit(req, res) {
    const {
      title,
      desc,
      published,
      content,
      thumbnailUrl,
      categories
    } = req.body;
    const { postId } = req.params;

    models.Posts
      .findOne({
        where: { id: postId }
      })
      .then((foundPost) => {
        let publishedAt = foundPost.publishedAt;
        if ((published === 'true') && !publishedAt) {
          publishedAt = new Date();
        } else if ((published === 'false') && publishedAt) {
          publishedAt = null;
        }

        const categoriesArray = (categories && categories.trim() !== '') ?
          categories.split(',').map(Number) :
          [...(foundPost.getCategories().map(foundCat => foundCat.id))];
        if (foundPost) {
          foundPost.update({
            title: (title && title.trim()) || foundPost.title,
            desc: desc || foundPost.desc,
            content: content || foundPost.content,
            authorId: foundPost.authorId,
            publishedAt,
            thumbnailUrl: thumbnailUrl || foundPost.thumbnailUrl,
          })
            .then(() => {
              models.Categories
                .findAll({
                  where: { id: [...categoriesArray] }
                })
                .then((foundCats) => {
                  foundPost.addCategories(
                    [...foundCats.map(foundCat => foundCat.id)]
                  );
                  // response on successful update of post & categories
                  return res.status(201).json({
                    foundPost
                  });
                })
                .catch((err) => {
                  // no category found errors
                  if (err) {
                    err = {
                      error: {
                        message: 'No category Found'
                      }
                    };
                    return res.status(500).json(err);
                  }
                });
            })
            .catch((err) => {
              if (err) {
                err = {
                  error: {
                    message: err.errors[0].message
                  }
                };
                return res.status(500).json(err);
              }
            });
        }
      })
      .catch((err) => {
        if (err) {
          err = {
            error: {
              message: err.errors[0].message
            }
          };
          return res.status(500).json(err);
        }
      });
  },

  /**
   * delete - delete a single post
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  delete(req, res) {
    const { postId } = req.params;
    return models.Posts
      .findOne({
        where: { id: postId }
      })
      .then((foundPost) => {
        if (foundPost) {
          models.Posts.destroy({
            where: {
              id: postId
            },
            force: true
          })
            .then(() => {
              res.status(201).json({
                message: 'This post has been deleted'
              });
            })
            .catch((err) => {
              if (err) {
                err = {
                  error: {
                    message: err.errors[0].message
                  }
                };
                return res.status(500).json(err);
              }
            });
        }
      })
      .catch((err) => {
        if (err) {
          err = {
            error: {
              message: err.errors[0].message
            }
          };
          return res.status(500).json(err);
        }
      });
  },

  /**
   * viewById - view a single post by id (add - Author detail)
   * also add categories they belong
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  viewById(req, res) {
    const { postId } = req.params;
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    return models.Posts
      .findOne({
        include: [
          {
            model: models.Users,
            include: [models.Profiles]
          },
          {
            model: models.Categories,
            as: 'Categories',
            required: false,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }
        ],
        where: { id: (postId || 1) }
      })
      .then((post) => {
        if (post) {
          // do viewCount Checks
          if (!post.readBy) {
            post.update({
              viewCount: post.viewCount + 1,
              readBy: [userIP]
            });
          } else if (post.readBy.includes(userIP) === false) {
            post.readBy.push(userIP);
            post.update({
              viewCount: post.viewCount + 1,
              readBy: post.readBy
            });
          }

          // response
          res.status(200).json({
            post
          });
        }
      })
      .catch((err) => {
        if (err) {
          err = {
            error: {
              message: err.errors[0].message
            }
          };
          return res.status(500).json(err);
        }
      });
  },

  /**
   * viewAll - view all post (only published) (add - Author detail)
   * also add categories they belong
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  viewAll(req, res) {
    const limitValue = req.query.limit || 10;
    const pageValue = (req.query.page - 1) || 0;
    return models.Posts
      .findAndCountAll({
        include: [
          {
            model: models.Users,
            include: [models.Profiles]
          },
          {
            model: models.Categories,
            as: 'Categories',
            required: false,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }
        ],
        where: {
          publishedAt: {
            $ne: null
          }
        },
        limit: limitValue,
        offset: pageValue * limitValue
      })
      .then((allPosts) => {
        const size = allPosts.rows.length;
        return res.status(200).json({
          pagination: paginate(allPosts.count - 1, limitValue, pageValue, size),
          posts: allPosts.rows
        });
      })
      .catch(err => res.status(500).json({ err }));
  },

  /**
   * adminViewAll - view all post (published and unpublished)
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  adminViewAll(req, res) {
    const limitValue = req.query.limit || 10;
    const pageValue = (req.query.page - 1) || 0;
    return models.Posts
      .findAndCountAll({
        include: [
          {
            model: models.Users,
            include: [models.Profiles]
          },
          {
            model: models.Categories,
            as: 'Categories',
            required: false,
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }
        ],
        limit: limitValue,
        offset: pageValue * limitValue
      })
      .then((allPosts) => {
        const size = allPosts.rows.length;
        return res.status(200).json({
          pagination: paginate(allPosts.count - 1, limitValue, pageValue, size),
          posts: allPosts.rows
        });
      })
      .catch(err => res.status(500).json({ err }));
  },

  /**
   * topFourPostPerCategory - view top 4 posts in all categories(only published)
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  topFourPostPerCategory(req, res) {
    // get first 5 categories
    const randomCatIds = getRandomInt(10, 4);
    models.Categories
      .findAll({
        where: {
          id: [1, ...randomCatIds]
        }
      })
      .then((fiveCategories) => {
        // get category Ids
        const catIds = fiveCategories.map(category => category.id);

        // get all postIds with this categoryIds from the PostCategories Table
        models.PostCategories
          .findAll({
            where: {
              categoryId: [...catIds]
            },
            order: [
              ['createdAt', 'DESC'],
              ['categoryId', 'ASC']
            ],
          })
          .then((postCategories) => {
            // get post Ids
            const postIds = postCategories.map(postCat => postCat.postId);

            // query the posts table for this posts and add their category
            models.Posts
              .findAll({
                where: {
                  id: [...postIds]
                },
                include: [
                  {
                    model: models.Categories,
                    as: 'Categories',
                    required: false,
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                  }
                ],
                order: [
                  ['createdAt', 'DESC']
                ],
                limit: 4
              })
              .then((foundPostPeeks) => {
                // prepare the final blogPeek object
                const blogPeek = foundPostPeeks.reduce((hash, post) => {
                  post.Categories.forEach((data) => {
                    const { Categories, ...postDetails } = post.dataValues;
                    /* eslint-disable */
                    hash[data.name] ?
                      hash[data.name].push(postDetails) :
                      hash[data.name] = [postDetails];
                  });
                  return hash;
                }, {});
                return res.status(200).json({
                  blogPeek
                });
              })
              .catch(err => res.status(500).json({ err }));
          })
          .catch(err => res.status(500).json({ err }));
      })
      .catch(err => res.status(500).json({ err }));
  }

  // /**
  //  * likePost - view all post (only published)
  //  *
  //  * @param {object} req
  //  * @param {object} res
  //  *
  //  * @return {object} user - data
  //  */
  // like(req, res) {

  // }
};
