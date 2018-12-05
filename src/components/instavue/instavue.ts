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
        facebook_access_token: "EAAEJ47TyfHoBAMnWKiVuGuewHVXMZA7zanwwh3OzJVjkJkqbZCZAmgImHmbhAylFDTzR5wDFURr4eweXviVd6ZAM54vCf1PbWFwx0G4iIQjViPZBga815fT0WkDVdTdQpuJGSxPRSYZCThLD87h2rEVSCZChpRUSYUWZAIcDZAFkZAhqFao49Ys9ZC5zDqlcaIL8GtMnoSVuKU7nQZDZD",
        facebook_url: "https://graph.facebook.com/v3.2/",
        facebook__field_getter: "/feed?fields=message,created_time,id,full_picture,picture,likes",
        facebook_user_id: "me",
        posts: [],
        blocks: [],
        show_twitter: true,
        show_facebook: true,
        show_instagram: true,
        error: false,
        isActive: true,
        extraViewerClass: 'active',
        numberItems: 6,
        showBlock: true,

      },
      computed: {

      },
      filters: {

      },
      methods: {
        showMore() {
          this.numberItems = this.numberItems + 3;
          Vue.nextTick().then(() => {

            this.twitterHandle();
            this.facebookHandle(); this.instagramHandle();

          });

        },
        characterLimit: function (text, length) {
          let clamp = '...';
          return text.length > length ? text.slice(0, length) + clamp : text;
        },
        twitterHandle() {
          // this.showBlock =!this.showBlock;
          let twitterblocks = this.$refs.twitter;
          if (!this.show_twitter) {

            for (let i = 0; i < twitterblocks.length; i++) {
              twitterblocks[i].classList.add('hidden')
            }
          }
          else {
            for (let i = 0; i < twitterblocks.length; i++) {
              twitterblocks[i].classList.remove('hidden')
            }
          }

        },
        facebookHandle() {
          let facebooklocks = this.$refs.facebook;
          if (!this.show_facebook) {
            for (let i = 0; i < facebooklocks.length; i++) {
              facebooklocks[i].classList.add('hidden')
            }
          }
          else {
            for (let i = 0; i < facebooklocks.length; i++) {
              facebooklocks[i].classList.remove('hidden')
            }
          }

        },
        instagramHandle() {
          let instagramblocks = this.$refs.instagram;

          if (!this.show_instagram) {
            for (let i = 0; i < instagramblocks.length; i++) {
              instagramblocks[i].classList.add('hidden')
            }
          }
          else {
            for (let i = 0; i < instagramblocks.length; i++) {
              instagramblocks[i].classList.remove('hidden')
            }
          }
        },
        getTweets() {
          let configProfile = {
            "profile": { "screenName": 'mhmargareth' },
            "domId": 'exampleProfile',
            "maxTweets": 20,
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
            arrayTweets[i].isActive = this.isActive;
            arrayTweets[i].newCaption = this.characterLimit(arrayTweets[i].tweet, 100)
          }
          this.createArray(arrayTweets)
        },
        getGrams() {
          return axios.get(this.instagram_url + "?access_token=" + this.instagram_access_token)
        },
        getPosts() {
          return axios.get(this.facebook_url + this.facebook_user_id + this.facebook__field_getter + "&access_token=" + this.facebook_access_token)
        },

        getAllArrays() {
          let vueApp = this;
          this.getTweets();
          axios.all([this.getPosts(), this.getGrams()]).then(axios.spread(function (facebook, instagram) {
            // FACEBOOK POSTS
            vueApp.posts = facebook.data.data;
            if (facebook.data.data) {
              for (let i = 0; i < vueApp.posts.length; i++) {
                vueApp.posts[i].origin = "facebook";
                vueApp.posts[i].newIndex = i;
                vueApp.posts[i].isActive = vueApp.isActive;
                vueApp.posts[i].fullUrl = "https://facebook.com/" + vueApp.posts[i].id;
                if (vueApp.posts[i].message) { vueApp.posts[i].newCaption = vueApp.characterLimit(vueApp.posts[i].message, 120) }
              }
              vueApp.createArray(vueApp.posts);
            }
            // INATAGRAM POSTS
            vueApp.grams = instagram.data.data;

            for (let i = 0; i < vueApp.grams.length; i++) {
              vueApp.grams[i].origin = "instagram";
              vueApp.grams[i].newIndex = i;
              if (vueApp.grams[i].caption) { vueApp.grams[i].newCaption = vueApp.characterLimit(vueApp.grams[i].caption.text, 90) }

            }
            vueApp.createArray(vueApp.grams)

          }))

        },

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

          console.log(this.blocks);
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
        this.getAllArrays();
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
