(function(){
  'use strict'
  angular.module('angularDemo', ['ngMaterial']); //initialize module

  //can reference model instead of creating a global variable
  angular.module('angularDemo').controller('angularController',
    ['$scope','ProductDataService', function($scope, ProductDataService) {
    var products = ProductDataService.getSampleData();
    $scope.Fruits = products; //use $scope to expose to the view

    //create checkbox filters on the fly with dynamic data
    var filters = [];
    _.each(products, function(product) {
      _.each(product.properties, function(property) {
        var existingFilter = _.findWhere(filters, { name: property.name });

        if (existingFilter) {
          var existingOption = _.findWhere(existingFilter.options, { value: property.value });
          if (existingOption) {
            existingOption.count += 1;
          } else {
            existingFilter.options.push({ value: property.value, count: 1 });
          }
        } else {
          var filter = {};
          filter.name = property.name;
          filter.options = [];
          filter.options.push({ value: property.value, count: 1 });
          filters.push(filter);
        }
      });
    });
    $scope.Filters = filters;

    this.toggleAll = function($event, includeAll) {
      _.each(filters, function(filterCategory) {
        _.each(filterCategory.options, function(option) {
          option.IsIncluded = includeAll;
        });
      });
    };
  }]);

  angular.module('angularDemo').filter('dynamicFilter', function () {
    return function (products, filterCategories, scope) {
      var filtered = [];

      var productFilters = _.filter(filterCategories, function(fc) {
        return  _.any(fc.options, { 'IsIncluded': true });
      });

      _.each(products, function(prod) {
        var includeProduct = true;
        _.each(productFilters, function(filter) {
          var props = _.filter(prod.properties, { 'name': filter.name });
          if (!_.any(props, function(prop) { return _.any(filter.options, { 'value': prop.value, 'IsIncluded': true }); })) {
            includeProduct = false;
          }
        });
        if (includeProduct) {
          filtered.push(prod);
        }
      });
      return filtered;
    };
  });

  angular.module('angularDemo').service('ProductDataService', function() {
    var service = {};

    //sample data
    var products = [
      {
        name: 'Mac & Cheese',
        img: 'img/macandcheese.jpg',
        url: 'https://www.southernliving.com/recipes/classic-baked-macaroni-and-cheese-recipe',
        properties: [
          { name:'Starch', value:'Noodles'}, { name:'Dairy', value:'Cheese'},
          { name:'Dairy', value:'Milk'}
        ]
      },{
        name: 'Bacon Wrap',
        img: 'img/baconwrap.jpg',
        url: 'https://www.foodnetwork.com/recipes/articles/50-bacon-appetizers',
        properties: [
          { name:'Starch', value:'Tortilla' }, { name:'Protein', value:'Bacon'},
          { name:'Protein', value:'Beef' }, { name:'Dairy', value:'Cheese'}
        ]
      },{
        name: 'Beef Tacos',
        img: 'img/beeftaco.jpg',
        url: 'https://www.oldelpaso.com/recipes/simple-beef-tacos',
        properties: [
          { name:'Starch', value:'Tortilla' }, { name:'Protein', value:'Beef' },
          { name:'Seasoning', value:'Taco Mix' }
        ]
      },{
        name: 'Fettucine Alfredo',
        img: 'img/alfredo.jpg',
        url: 'https://juliasalbum.com/creamy-broccoli-chicken-and-bacon-pasta-recipe/',
        properties: [
          { name:'Starch', value:'Noodles' }, { name:'Dairy', value:'Milk' },
          { name:'Dairy', value:'Heavy Cream' }, { name:'Dairy', value:'Chese' },
          { name:'Veggie', value:'Broccoli'}, { name: 'Protein', value: 'Bacon'},
          { name:'Veggie', value: 'Garlic'}, {name: 'Seasoning', value: 'Salt + Pepper'},
          { name:'Protein', value: 'Chicken'}
        ]
      },{
        name: 'Apple Squares',
        img: 'img/apple.jpg',
        url: 'https://juliasalbum.com/apple-squares-recipe/',
        properties: [
          { name:'Fruit', value:'Apples' }, { name: 'Seasoning', value: 'Cinammon' },
          { name:'Starch', value:'AP Flour' }, { name: 'Protein', value: 'Eggs' },

        ]
      },{
        name:'Chicken Pesto',
        img: 'img/pesto.jpg',
        url: 'https://studenteats.co.uk/recipes/pasta/chicken-pesto-pasta-with-roasted-tomatoes-5598.html',
        properties: [
          { name:'Protein', value:'Chicken' }, { name:'Starch', value:'Noodles' },
          { name:'Seasoning', value:'Pesto Sauce' }, { name:'Fruit', value:'Tomatoes' },
          {name:'Seasoning', value:'Garlic Powder'}, {name:'Dairy', value:'Cheese'}
        ]
      },{
        name:'Roasted Potatoes',
        img: 'img/potatoes.jpg',
        url: 'https://www.thekitchn.com/recipe-crispy-salt-amp-vinegar-potatoes-227532',
        properties: [
          { name:'Starch', value:'Potato' },
          { name:'Seasoning', value:'White Vinegar' }, { name:'Seasoning', value:'Salt + Pepper' }

        ]
      },{
        name:'Breadsticks',
        img: 'img/breadstick.jpg',
        url: 'http://sugarapron.com/2014/08/03/easy-cheesy-garlic-breadsticks/',
        properties: [
          { name:'Starch', value:'Pizza Crust' }, { name:'Dairy', value:'Cheese' },
          { name:'Seasoning', value:'Basil' }, { name:'Seasoning', value:'Salt + Pepper' },
          {name:'Dairy', value:'Butter'}
        ]
      },{
        name:'Curry Drumsticks',
        img: 'img/curry.jpg',
        url: 'https://alittleyum.com/2010/04/07/curried-chicken-drumsticks-with-carrots/',
        properties: [
          { name:'Protein', value:'Drumsticks' }, { name:'Seasoning', value:'Curry Powder' },
          { name:'Veggie', value:'Carrots' }, { name:'Starch', value:'Rice' }
        ]
      },{
        name:'Carrot Cake',
        img: 'img/carrot.jpg',
        url: 'https://mildlymeandering.com/carrot-cake-mug-cake/',
        properties: [
          { name:'Veggie', value:'Carrots' }, { name:'Dairy', value:'Milk' },
          { name:'Seasoning', value:'Nutmeg' }, { name:'Seasoning', value:'Nutmeg' }
        ]
      },{
        name:'Cajun Alfredo',
        img: 'img/cajun.jpg',
        url:'https://tasty.co/recipe/cajun-chicken-alfredo',
        properties: [
          { name:'Starch', value:'Penne' }, { name:'Veggie', value:'Garlic' },
          { name:'Protein', value:'Chicken' }, { name:'Seasoning', value:'Cajun' }
        ]
      },{
        name:'Brownies',
        img: 'img/brownie.jpg',
        url:'http://tgifridaysathome.blogspot.com/2012/10/brownie-obsession.html',
        properties: [
          { name:'Starch', value:'Brownie Mix' }, { name:'Dairy', value:'Ice Cream' },
          { name:'Seasoning', value:'Caramel' }, { name:'Seasoning', value:'Nutmeg' }
        ]
      },{
        name:'Asparagus',
        img: 'img/asparagus.jpg',
        url:'https://www.allrecipes.com/recipe/214931/oven-roasted-asparagus/',
        properties: [
          { name:'Veggie', value:'Asparagus' }, { name:'Veggie', value:'Garlic' },
          { name:'Seasoning', value:'Salt + Pepper' }
        ]
      },{
        name:'Beef Stroganoff',
        img: 'img/beefstroganoff.jpg',
        url:'https://www.bettycrocker.com/recipes/classic-beef-stroganoff/c17a904f-a8f6-48ae-bedb-5b301a8ea317',
        properties: [
          { name:'Veggie', value:'Carrots' }, { name:'Dairy', value:'Milk' },
          { name:'Seasoning', value:'Nutmeg' }, { name:'Seasoning', value:'Nutmeg' }
        ]
      },{
        name:'Chicken StirFry',
        img: 'img/chickenstirfry.jpg',
        url:'https://www.allrecipes.com/recipe/223382/chicken-stir-fry/',
        properties: [
          { name:'Veggie', value:'Carrots' }, { name:'Veggie', value:'Peppers' },
          { name:'Seasoning', value:'Prepacked' }, { name:'Protein', value:'Chicken' },
          { name:'Veggie', value:'Snap Peas' }
        ]
      },{
        name:'Chicken Burritos',
        img: 'img/chickenburritos.jpg',
        url:'https://www.tasteofhome.com/recipes/chicken-burritos',
        properties: [
          { name:'Starch', value:'Tortilla' }, { name:'Protein', value:'Chicken' },
          { name:'Dairy', value:'Cheese' }, {name:'Seasoning', value:'Prepacked'}
        ]
      },
      {
        name:'Red Curry Chicken',
        img: 'img/coconutcurry.jpg',
        url:'https://www.allrecipes.com/recipe/261479/four-ingredient-red-curry-chicken/?internalSource=staff%20pick&referringId=1947&referringContentType=Recipe%20Hub',
        properties: [
          { name:'Starch', value:'Vermicelli Noodles' }, { name:'Veggie', value:'Peppers' },
          { name:'Seasoning', value:'Thai Curry Sauce' }, { name:'Protein', value:'Chicken' },
          { name:'Dairy', value:'Coconut Milk' }
        ]
      },{
        name:'Saucy Bean Baked Eggs',
        img: 'img/bakedeggs.jpg',
        url:'https://www.bbcgoodfood.com/recipes/saucy-bean-baked-eggs',
        properties: [
          { name:'Starch', value:'Rye Bread' }, { name:'Protein', value:'Smoked Ham' },
          { name:'Veggie', value:'Spinach' }, { name:'Protein', value: 'Bean Salad'},
          { name:'Seasoning', value:'Prepacked'}, { name:'Protein', value:'Eggs'}, 
          { name:'Fruit', value:'Tomatoes'}
        ]
      },{
        name:'Chipotle Bean Chili',
        img: 'img/chipotlechili.jpg',
        url:'https://www.bbcgoodfood.com/recipes/chipotle-bean-chilli-baked-eggs',
        properties: [
          { name:'Starch', value:'Tortilla' }, { name:'Protein', value:'Eggs' },
          { name:'Protein', value:'Black Beans' }, {name:'Protein', value:'Mixed Beans'},
          { name:'Seasoning', value:'Chipotle Paste'}, {name:'Seasoning', value:'Corander Leaves'},
          { name:'Fruit', value:'Tomatoes'} 
        ]
      },{
        name:'Enchilada Casserole',
        img: 'img/enchilada.jpg',
        url:'https://www.theseasonedmom.com/4-ingredient-healthy-chicken-enchilada-casserole/',
        properties: [
          { name:'Starch', value:'Tortilla' }, { name:'Protein', value:'Chicken' },
          { name:'Dairy', value:'Cheese' }, {name:'Seasoning', value:'Enchilada Sauce'}
        ]
      },{
        name:'Lemon Chicken',
        img: 'img/lemonchick.jpg',
        url:'https://hostthetoast.com/5-ingredient-breaded-lemon-chicken/',
        properties: [
          { name:'Starch', value:'Breadcrumbs' }, { name:'Protein', value:'Chicken' },
          { name:'Fruit', value:'Lemon' }, {name:'Seasoning', value:'Lemon Pepper'}
        ]
      },{
        name:'Tomato Soup',
        img: 'img/tomatosoup.jpg',
        url:'https://www.wholesomeyum.com/recipes/5-ingredient-roasted-tomato-soup-low-carb-gluten-free/',
        properties: [
          { name:'Fruit', value:'Tomatoes'}, { name:'Dairy', value:'Heavy Cream'}, 
	        { name:'Veggie', value:'Basil'}, { name:'Seasoning', value:'Herbs de Provence'}
	      ]
      },{
        name:'Bacon Asparagus Pasta',
        img: 'img/bapasta.jpg',
        url:'https://www.gimmesomeoven.com/5-ingredient-bacon-asparagus-pasta-recipe/',
        properties: [
          { name:'Starch', value:'Pasta' }, { name:'Protein', value:'Bacon' },
          { name:'Dairy', value:'Cheese' }, {name:'Seasoning', value:'White Wine'},
	        { name:'Vaggie', value:'Asparagus'}
        ]
      },{
        name:'Caprese Chicken',
        img: 'img/capchick.jpg',
        url:'https://www.seasonalcravings.com/five-ingredient-caprese-chicken/#wprm-recipe-container-5960',
        properties: [
          { name:'Veggie', value:'Basil' }, { name:'Protein', value:'Chicken' },
          { name:'Dairy', value:'Cheese' }, {name:'Seasoning', value:'Balsamic Syrup'},
	        { name:'Fruit', value: 'Tomatoes'}
        ]
      },{
        name:'Chipotle Taquitos',
        img: 'img/taquitos.jpg',
        url:'https://www.foodiecrush.com/chipotle-chicken-taquitos/',
        properties: [
          { name:'Starch', value:'Tortilla' }, { name:'Protein', value:'Chicken' },
          { name:'Dairy', value:'Cheese' }, {name:'Veggie', value:'Chipotle Peppers'}
        ]
      }
    ];

    service.getSampleData = function() {
      return products;
    };

    return service;
  });

})();
