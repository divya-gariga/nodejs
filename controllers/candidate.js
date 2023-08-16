const Candidate = require('../models/candidate');
const Courtsearch = require('../models/courtsearch');
const report = require('../models/report').reportModel;

exports.getCandidates = (req, res, next) => {
    Candidate.find().then(candidates => {
        return res.status(200).json({
          message: 'Fetched candidates successfully.',
          candidates: candidates,
        });
      })
      .catch(err => {
        return res.status(404).json({ message: 'unable to fetch candidates.' });
      });
};

exports.getCandidate = (req, res, next) => {
  const candidateId = req.params.candidateId;
  Candidate.findById(candidateId)
    .then(candidate => {
      if (!candidate) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({ message: 'candidate fetched.', candidate: candidate });
    })
    .catch(err => {
      return res.status(404).json({ message: err.message });
    });
};

exports.createCandidate = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const dob = req.body.dob;
  const reports = req.body.reports || {};
  const candidate = new Candidate({
    name: name,
    email: email,
    phone: phone,
    dob: dob,
    reports: reports
  });
  candidate
    .save()
    .then(result => {
      console.log('Created Candidate');
      return res.status(201).json({ message: 'Candidate created successfully', candidate: result });
    })
    .catch(err => {
      console.log(err);
      return res.status(422).json({ error: err.message });
    });
};

exports.deleteCandidate= (req, res, next) => {
  const candidateId = req.params.candidateId;
  Candidate.findByIdAndDelete(candidateId)
    .then(async candidate => {
      if (!candidate) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      await Courtsearch.deleteMany({ 'candidate_id': candidateId })
      return res.status(200).json({ message: 'candidate deleted.'});
    })
    .catch(err => {
      return res.status(404).json({ message: err.message });
    });
};

exports.getReportByCandId = (req, res, next) => {
  const candidateId = req.params.candidateId;
  Candidate.findById(candidateId)
    .then(candidate => {
      if (!candidate) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      const r = candidate.reports;
      return res.status(200).json({ message: 'report fetched.', reports: r });
    })
    .catch(err => {
      return res.status(404).json({ message: err.message });
    });
};

exports.updateReportByCandId = (req, res, next) => {
  const candidateId = req.params.candidateId;
  Candidate.findById(candidateId)
    .then(async candidate => {
      if (!candidate) {
        const error = new Error('Could not find candidate.');
        error.statusCode = 404;
        throw error;
      }
      const r = candidate.reports;
      r.set(req.body);
      await candidate.save();
      return res.status(200).json({ message: 'updated report'});
    })
    .catch(err => {
      return res.status(404).json({ message: err.message });
    });
};




