
// Load the module dependencies
const User = require('mongoose').model('User')

// Create a new error handling controller method
const getErrorMessage = err => {
  // Define the error message variable
  let message = ''

  // If an internal MongoDB error occurs get the error message
  if (err.code) {
    switch (err.code) {
      // If an unique index error occurs set the message error
      case 11000:
      case 11001:
        message = 'Username already exists'
        break
      // If a general error occurs set the message error
      default:
        message = 'Something went wrong'
    }
  } else {
    // Grab the first error message from a list of possible errors
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message
    }
  }

  // Return the message error
  return message
}

// Create a new controller method that renders the signin page
exports.renderSignin = async (ctx, next) => {
  // If user is not connected render the signin page, otherwise redirect the user back to the main appliaction page
  if (!ctx.req.user) {
    ctx.state = {
      title: 'Sign-in Page'
    }
    // render the signin page
    await ctx.render('signin', ctx.state)
  } else {
    return ctx.redirect('/')
  }
}

// Create a signin test controller
exports.signintest = async (ctx, next) => {
  console.log(111)
  const passport = require('koa-passport')
  const LocalStrategy = require('passport-local').Strategy
  // 定义passport处理用户信息的方法
  console.log(`222 start serializeUser`)
  passport.serializeUser((user, done) => {
    console.log(`serializeUser, user.id ${user.id}`)
    done(null, user.id)
  })
  console.log(`333 start deserializeUser`)
  passport.deserializeUser(async (id, done) => {
    console.log(`deserializeUser, id ${id}`)
    const query = User.findOne({_id: id}, '-passport -salt')
    await query.exec()
          .then(user => {
            console.log(`fetch user info by id from db. id ${user._id}`)
            done(null, user)
          })
          .catch(err => {
            done(err)
          })
  })
  // 注册了策略
  console.log(`444 start register local strategy`)
  passport.use(new LocalStrategy(async (username, password, done) => {
    console.log(`in local strategy, username ${username}, password ${password}`)
    const query = User.findOne({ username: username }) 
    const promise = query.exec()
    await promise.then((userDoc) => {
      console.log(`start authenticate`)
      if (!userDoc) { return done(null, false, {message: 'Unknown user'}); }
      if (!userDoc.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' })
      }
      console.log(`authenticate success`)
      return done(null, userDoc)
    })
    .catch(err => {
      return done(err);
    })
    


  }))
  
}

// Create a new controller method that renders the signup page
exports.renderSignup = async (ctx, next) => {
  // If user is not connected render the signup page, otherwise redirect the user back to the main application page
  if (!ctx.req.user) {
    ctx.state = {
      title: 'Sign-up Page'
    }
    // render the signup page
    await ctx.render('signup', ctx.state)
  } else {
    return ctx.redirect('/')
  }
}
// Create a new controller method that creates new 'regular' users
exports.signup = async (ctx, next) => {
  // If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
  console.log('ctx.request.user',ctx.request.user)
  if (!ctx.request.user) {
    console.log('ctx.request.body',ctx.request.body)
    // Create a new 'User' model instance
    const user = new User(ctx.request.body)
    let message
    // Set the user provider property
    user.provider = 'local'
    // Try saving the new user document
    console.log('before user.save')
    await user.save()
      .then(doc => {
          // If the user was created successfully, redirect to signin page to login
          ctx.redirect('/signin')
        },
      )
      .catch(err => {
        console.log('err on save',err)
        // Use the error handling method to get the error message
        message = getErrorMessage(err)
        // Redirect the user back to the signup page
        ctx.redirect('/signup')
      })
    console.log('after user.save')
  } else {
    return ctx.redirect('/')
  }
}

// Create a new controller method for signing out
exports.signout = (ctx) => {
  // Use the Passport 'logout' method to logout
  ctx.logout()
  // Redirect the user back to the main application page
	ctx.redirect('/');
}

