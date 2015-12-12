$(function(){
  console.log('working');
  initialize();
})

function initialize(){
  $('.gridsquare').on('click', function(){
    console.log('click');
  })
}