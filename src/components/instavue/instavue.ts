import Vue from 'vue';
import axios from 'axios';

import * as twitterFetcher from 'twitter-fetcher'

export default class socialVue {
  private appElement;
  public vueApp;

  public constructor(appElement: HTMLElement) {
    this.appElement = appElement;
    this.vueApp = new Vue({
      el: this.appElement,
      data: {
        //instagram
        instagram_access_token: "749181997.e642e38.68bfa1d6f0c64ca98fe749f93be926c3",
        instagram_url: "https://api.instagram.com/v1/users/self/media/recent/",
        instagram_username: "",
        grams: [],
        instagram_next_url: "",
        //facebook
        facebook_access_token: "EAAEJ47TyfHoBABvYBt5K8K6rjBZACaUD8CDwfmhf6m62JUiEwsNSZARoSct3zbBDZAzIDLNQUnCW1rgX9LRzN1NZAoFij6wKWo6auZBPn0uR5xYRV8UwdWtCtXkYX8HnAWFDG335MMGq4vq9SfP1VuAjD14VSZCVzLMftR5BtYTFVoUkoxrFZCrYjcXG1jiSAmP2HcclxLk7wZDZD",
        facebook_url: "https://graph.facebook.com/v3.2/",
        facebook__field_getter: "/feed?fields=message,created_time,id,full_picture,picture,likes",
        facebook_user_id: "301249666926209",
        posts: [],
        blocks: [],
        show_twitter: true,
        show_facebook: true,
        show_instagram: true,
        error: false,
        isActive: false,
        extraViewerClass: 'active',

      },
      computed: {

      },
      methods: {
        twitterHandle() {
          let twiterblocks = this.$refs.twitter;
          for (let i = 0; i < twiterblocks.length; i++) {
            twiterblocks[i].classList.toggle('hidden')

          }
        },
        facebookHandle() {
          let facebooklocks = this.$refs.facebook;
          for (let i = 0; i < facebooklocks.length; i++) {
            facebooklocks[i].classList.toggle('hidden')
          }
        },
        instagramHandle() {
          let instagramblocks = this.$refs.instagram;
          for (let i = 0; i < instagramblocks.length; i++) {
            instagramblocks[i].classList.toggle('hidden')
          }
        },
        getTweets() {
          let configProfile = {
            "profile": { "screenName": 'mhmargareth' },
            "domId": 'exampleProfile',
            "maxTweets": 10,
            "enableLinks": true,
            "showUser": true,
            "showTime": true,
            "showImages": true,
            "lang": 'en',
            "customCallback": this.createTwitterFeed,
            "dataOnly": true,
          };
          twitterFetcher.fetch(configProfile);
        },
        createTwitterFeed(arrayTweets) {

          for (let i = 0; i < arrayTweets.length; i++) {
            arrayTweets[i].origin = "twitter";
            arrayTweets[i].newIndex = i;

          }
          this.createArray(arrayTweets)

        },
        getGrams() {
          axios.get(this.instagram_url + "?access_token=" + this.instagram_access_token)
            .then(({ data }) => {
              this.grams = data.data
              for (let i = 0; i < this.grams.length; i++) {
                this.grams[i].origin = "instagram";
                this.grams[i].newIndex = i;
              }
              this.createArray(this.grams)
              // console.log(this.grams)
              //  this.blocks=this.blocks.concat(this.grams);
              //  console.log(this.blocks)
              this.instagram_username = data.data[0].user.username
              this.instagram_next_url = data.pagination.next_url
            })
            .catch(function (error) {
              console.log(error)
              this.error = true
            });
        },
        getPosts() {
          axios.get(this.facebook_url + this.facebook_user_id + this.facebook__field_getter + "&access_token=" + this.facebook_access_token)
            .then(({ data }) => {

              this.posts = data.data;
              for (let i = 0; i < this.posts.length; i++) {
                this.posts[i].origin = "facebook";
                this.posts[i].newIndex = i;
                this.posts[i].fullUrl = "https://facebook.com/" + this.posts[i].id;
                this.posts[i].origin = "facebook";
                // delete this.posts[key];
              }
              // this.blocks=this.blocks.concat(this.posts);
              // console.log(this.blocks)
              //console.log(this.posts)
              this.createArray(this.posts)
            })
            .catch(function (error) {
              console.log(error)
              this.error = true
            });
        },
        // getTwits() {
        //   console.log(this.twits);
        //   this.createArray(this.twits)
        //   // this.createArray(newTArray)
        // },
        createArray(array) {
          this.blocks = this.blocks.concat(array);

          function predicateBy(prop) {
            return function (a, b) {
              if (a[prop] > b[prop]) {
                return 1;
              } else if (a[prop] < b[prop]) {
                return -1;
              }
              return 0;
            }
          }

          //Usage
          this.blocks.sort(predicateBy("newIndex"));
          // console.log(this.blocks);
        },
        getMoreGrams() {
          axios.get(this.instagram_next_url)
            .then(({ data }) => {
              this.grams = this.grams.concat(data.data)
              this.instagram_next_url = data.pagination.next_url
            })
            .catch(function (error) {
              console.log(error)
              this.error = true
            });
        }
      },
      beforeMount() {
        this.getGrams();
        this.getPosts();
        this.getTweets();
      },
    });

  }

}

function instaVueInit() {
  let socialVueApp = document.querySelectorAll(
    ".social-app"
  ) as NodeList;
  if (socialVueApp.length > 0) {
    for (let i = 0; i < socialVueApp.length; i++) {
      let thisElement = <HTMLElement>socialVueApp[i];
      new socialVue(thisElement);

    }
  }
}

export { socialVue, instaVueInit };
