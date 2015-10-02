
//register a controller to this route - for anything matching to this URI - talk to this controller
module.exports={
    '/issues' : require('./controllers/IssueController')
}