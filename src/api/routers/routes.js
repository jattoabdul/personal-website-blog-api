import { users, categories, posts, contact } from '../controllers';
import { authenticate, validate } from '../middlewares';

export default (app) => {
/**
* API routes.
*/

  // base API Route
  app.get('/api/v1', (req, res) => {
    res
      .status(200)
      .send({ message: 'Welcome to Personal Website and Blog Project API' });
  });

  // reset password API route - for current user to request password reset link
  app.post('/api/v1/users/reset/request',
    users.passwordReset);

  // update password API route - for current user's new password to be updated
  app.post('/api/v1/users/reset/:hash',
    users.updatePassword);

  // signup API Route - for creating a user
  app.post('/api/v1/users/signup', validate.signUp, users.signUp);

  // signin API Route - for authenticaticating a user
  app.post('/api/v1/users/signin', validate.signIn, users.authenticate);

  // Protected Routes

  // API route to get list of all users
  app.get('/api/v1/users',
    authenticate.user,
    authenticate.permit('admin', 'editor'),
    authenticate.user,
    users.getAllUsers
  );

  // API route for current user to get their details
  app.get('/api/v1/user',
    authenticate.user,
    authenticate.permit('admin', 'editor', 'reader'),
    authenticate.user,
    users.getCurrentUser
  );

  // API route for admin & editors to view users details by id
  app.get('/api/v1/user/:id',
    authenticate.user,
    authenticate.permit('admin', 'editor'),
    users.viewUserDetail
  );

  // API route for readers, admin & editors to edit user
  // if ?userId= param is passed as an admin, update the user
  // if roleId passed as admin, update the user role
  app.patch('/api/v1/user',
    validate.editProfile,
    authenticate.user,
    authenticate.permit('admin', 'editor', 'reader'),
    users.editProfile
  );

  // category
  // API route for admin & editors to create categories
  app.post('/api/v1/category',
    validate.createCategory,
    authenticate.user,
    authenticate.permit('admin', 'editor'),
    categories.create
  );

  // API route for admin & editors to edit categories
  app.patch('/api/v1/category/:categoryId',
    authenticate.user,
    authenticate.permit('admin', 'editor'),
    categories.edit
  );

  // API route for admin & editors to delete categories
  app.delete('/api/v1/category/:categoryId',
    authenticate.user,
    authenticate.permit('admin', 'editor'),
    categories.delete
  );

  // API route for reader, admin & editors to view category by Id
  app.get('/api/v1/category/:categoryId',
    authenticate.user,
    authenticate.permit('admin', 'editor'),
    categories.viewById
  );

  // API route for reader, admin & editors to view all category
  app.get('/api/v1/category',
    // authenticate.user,
    // authenticate.permit('admin', 'editor', 'reader'),
    categories.viewAll
  );

  // posts
  // API route for admin & editors to create posts
  app.post('/api/v1/post',
    validate.createPost,
    authenticate.user,
    authenticate.permit('admin', 'editor'),
    posts.create
  );

  // API route for admin & editors to edit post
  app.patch('/api/v1/post/:postId',
    authenticate.user,
    authenticate.permit('admin', 'editor'),
    posts.edit
  );

  // API route for admin & editors to delete posts
  app.delete('/api/v1/post/:postId',
    authenticate.user,
    authenticate.permit('admin', 'editor'),
    posts.delete
  );

  // API route for guest, reader, admin & editors to view post by Id
  app.get('/api/v1/post/:postId',
    // authenticate.user,
    // authenticate.permit('admin', 'editor', 'reader'),
    posts.viewById
  );

  // API route for reader, admin & editors to view all published posts
  app.get('/api/v1/posts',
    authenticate.user,
    authenticate.permit('admin', 'editor', 'reader'),
    posts.viewAll
  );

  // API route for admin & editors to view all posts
  app.get('/api/v1/admin/posts',
    authenticate.user,
    authenticate.permit('admin', 'editor'),
    posts.adminViewAll
  );

  // API route for guests,reader, admin & editors to view topFourPostPerCategory
  app.get('/api/v1/posts/peeks',
    // authenticate.user,
    // authenticate.permit('admin', 'editor', 'reader'),
    posts.topFourPostPerCategory
  );

  // Contact
  app.post('/api/v1/contact',
    validate.contactDetail,
    // authenticate.user,
    // authenticate.permit('admin', 'editor', 'reader'),
    contact.sendMessage
  );

  // Subscribe
  app.post('/api/v1/contact/subscribe',
    validate.subscribeDetail,
    // authenticate.user,
    // authenticate.permit('admin', 'editor', 'reader'),
    contact.subscribeToPosts
  );
};
