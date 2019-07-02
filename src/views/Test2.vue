<template>
  <div class="test">
    <ugly-row style="height: calc(100vh)">
      <ugly-column class="col-yi" style="height: 100%">
        <ugly-vertical-scrollbar>
          <ugly-menu
            :menu-list="menuList"
            style="width: 100%">
          </ugly-menu>
        </ugly-vertical-scrollbar>
      </ugly-column>
      <ugly-column class="col-xin">
        <div style="height: 500px; background-color: dodgerblue"></div>
      </ugly-column>
    </ugly-row>
  </div>
</template>

<script>
import crypto from 'crypto'
export default {
  name: 'test2',
  data () {
    return {
      menuList: [
        {
          id: this.getId(),
          title: 1,
          path: '/',
          children: [
            {
              id: this.getId(),
              title: 1,
              path: '/',
              children: [
                {
                  id: this.getId(),
                  title: 1,
                  path: '/',
                  children: [
                    {
                      id: this.getId(),
                      title: 1,
                      path: '/',
                      children: [
                        {
                          id: this.getId(),
                          title: 1,
                          path: '/'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: this.getId(),
          title: 2,
          path: '/',
          children: [
            {
              id: this.getId(),
              title: 1,
              path: '/',
              children: [
                {
                  id: this.getId(),
                  title: 1,
                  path: '/',
                  children: [
                    {
                      id: this.getId(),
                      title: 1,
                      path: '/',
                      children: [
                        {
                          id: this.getId(),
                          title: 1,
                          path: '/'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: this.getId(),
          title: 2,
          path: '/',
          children: [
            {
              id: this.getId(),
              title: 1,
              path: '/',
              children: [
                {
                  id: this.getId(),
                  title: 1,
                  path: '/',
                  children: [
                    {
                      id: this.getId(),
                      title: 1,
                      path: '/',
                      children: [
                        {
                          id: this.getId(),
                          title: 1,
                          path: '/'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: this.getId(),
          title: 2,
          path: '/',
          children: [
            {
              id: this.getId(),
              title: 1,
              path: '/',
              children: [
                {
                  id: this.getId(),
                  title: 1,
                  path: '/',
                  children: [
                    {
                      id: this.getId(),
                      title: 1,
                      path: '/',
                      children: [
                        {
                          id: this.getId(),
                          title: 1,
                          path: '/'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    getId () {
      let myDate = new Date()
      let md5 = crypto.createHash('md5')
      md5.update(myDate.getTime().toString())
      return md5.digest('hex') + Math.ceil(Math.random() * 10).toString()
    }
  }
}
</script>

<style scoped>
.test {
  width: 100%;
  height: 100%;
  background-color: aliceblue;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
