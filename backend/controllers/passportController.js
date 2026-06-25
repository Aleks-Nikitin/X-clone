import passport from "passport"
import {prisma} from "../lib/prisma.js"
import {Strategy as GitHubStrategy} from "passport-github2"



passport.use( new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, async function(accessToken,refreshToken,profile,done){
    try {
      const userEmail = profile.emails && profile.emails[0]?
      profile.emails[0].value : `${profile.username}@github-hidden.com`

      const dbUser = await prisma.user.upsert({
    where:{
      id:Number(profile.id)
    }, update:{
      picture: profile.photos?.[0]?.value || null
    },
    create:{
      id: Number(profile.id),
      email:userEmail,
      username:profile.username,
      fullName:profile.displayName || null,
      picture:profile.photos?.[0]?.value || null
    }
  })
  return done(null,dbUser);
      
    } catch (error) {
      return done(error,null)
    }
 
}


))