const mongoose = require('mongoose');
const mongooseAlgolia = require('mongoose-algolia');
const Schema = mongoose.Schema;

const GigSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  title: String,
  category: String,
  about: String,
  price: Number,
  picture: { type: String, default: 'http://placehold.it/350x150'},
  created: { type: Date, default: Date.now }
});

GigSchema.plugin(mongooseAlgolia,{
  appId: 'L3E3RMHJBU',
  apiKey: '9cb4a910e7442c50a8758bdb02e40d1c',
  indexName: 'GigSchema', 
  selector: 'title _id owner category about price picture', 
  populate: {
    path: 'owner',
    select: 'name'
  },
  defaults: {
    author: 'unknown'
  },
  mappings: {
    title: function(value) {
      return `Title: ${value}`
    }
  },
  debug: true 
});


let Model = mongoose.model('Gig', GigSchema);

Model.SyncToAlgolia(); 
Model.SetAlgoliaSettings({
  searchableAttributes: ['title','owner.name'] 
});

module.exports = Model;
