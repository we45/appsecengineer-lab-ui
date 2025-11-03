<template>
  <q-layout class="signup-confirm-background">
    <q-page-container>
      <q-page>
        <div class="row">
          <div class="col-3"></div>
          <div class="col">
            <q-card class="my-card" style="margin-top: 23%">
              <q-card-section>
                <div class="envelope">
                  <div class="paper"></div>
                </div>
                <h4 class="appsec-h1-lg-bold text-center">Subscription has been expired</h4>
                <br />
                <p class="appsec-h2-lg text-center ase-md">
                  Please write to
                  <b>help@appsecengineer.com</b>
                  to make changes to your subscription
                </p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3"></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: 'SubscriptionEndMessage'
}
</script>

<style lang="scss" scoped>
body {
  background: #70bbd9;
  padding: 50px;
}

.envelope {
  position: relative;
  margin: 50px auto 0;
  width: 98px;
  height: 66px;
  background: #c94548;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 0 1px #c94548 inset;
}
.envelope:before,
.envelope:after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border: 0 solid transparent;
  border-width: 33px 49px;
}
.envelope:before {
  border-bottom-color: #c94548;
  top: -100%;
  left: 0px;
}
.envelope:after {
  border-right-color: #ed4c50;
  border-left-color: #fa565a;
  border-bottom-color: #fa565a;
  top: 0;
  border-radius: 0 0 5px 5px;
  transform: rotate(360deg);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
}

.paper {
  background: #fff;
  width: 87px;
  height: 66px;
  margin: 0 auto;
  border-radius: 5px;
  position: absolute;
  left: 6px;
  top: -33px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
}
.paper:before,
.paper:after {
  content: '';
  position: absolute;
  left: 12px;
  background: #e3f1fc;
  height: 4px;
  border-radius: 5px;
}
.paper:before {
  top: 14px;
  width: 31px;
}
.paper:after {
  right: 12px;
  top: 28px;
  box-shadow: 0 8px 0 #e3f1fc, 0 16px 0 #e3f1fc, 0 24px 0 #e3f1fc, 0 40px 0 #e3f1fc;
}
</style>
