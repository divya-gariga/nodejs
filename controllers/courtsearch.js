const Courtsearch = require('../models/courtsearch');
const Candidate = require('../models/candidate');

exports.getCourtSearches = (req,res,next) => {
    Courtsearch.find().then(result => {
        return res.status(200).json({
          message: 'Fetched court searches successfully.',
          courtsearches: result,
        });
      })
      .catch(err => {
            return res.status(422).json({
                error: 'unable to fetch court searches ' + err});
      });}

exports.createCourtSearches = (req, res, next) => {
    const search = req.body.search;
    const status = req.body.status;
    const created_date = req.body.created_date;
    const candidate_id = req.body.candidate_id;
    Candidate.findOne({ '_id' : candidate_id})
        .then(candidate => {
            if (!candidate) {
               return res.status(404).json({ error: 'Candidate not found' });
            }
            const courtsearch = new Courtsearch({
                search,
                status,
                created_date,
                candidate_id,
            });
            return courtsearch.save();
        })
        .then(() => {
            return res.status(200).json({ message: 'court search created.' });
        })
        .catch(error => {
            console.error('Error saving courtsearch:', error);
            return res.status(404).json({
                error: 'An error occurred while saving courtsearch: ' + error,
            });
        });
}

exports.getCourtSearchesByCandId = async (req, res, next) => {
    const candidateId = req.params.candidateId;
    const candidate = await Candidate.findOne({ '_id': candidateId })
    if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
    }
    Courtsearch.find({ 'candidate_id': candidateId })
        .then(result => {
            return res.status(200).json({ message: 'court searches fetched for given candidate id.', courtsearches: result });
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ message: 'courtsearches unable to fetch for given candidate.' });
          });
}
