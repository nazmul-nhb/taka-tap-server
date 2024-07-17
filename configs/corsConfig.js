const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://taka-tap-nhb.vercel.app',
    'https://taka-tap-nhb-nazmul-hassans-projects.vercel.app',
    'https://taka-tap-nhb-git-main-nazmul-hassans-projects.vercel.app'

];

// make dynamic link for every vercel deployment
const dynamicOriginPattern = /^https:\/\/taka-tap-[a-z0-9]+-nazmul-hassans-projects\.vercel\.app$/;

export const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || dynamicOriginPattern.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not Allowed by CORS!'));
        }
    }
};
