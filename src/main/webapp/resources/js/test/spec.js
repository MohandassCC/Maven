//describe('Filters', function(){ //describe your object type
//    beforeEach(module('MyApp')); //load module
//    describe('reverse',function(){ //describe your app name
//        var reverse;
//        beforeEach(inject(function($filter){ //initialize your filter
//            reverse = $filter('reverse',{});
//        }));
//        it('Should reverse a string', function(){  //write tests
//            expect(reverse('rahil')).toBe('lihar'); //pass
//            expect(reverse('don')).toBe('nod'); //pass
//            //expect(reverse('jam')).toBe('oops'); // this test should fail
//        });
//    });
//});

describe('navController', function() {
    var scope, $location, createController;
    beforeEach(module('CJApp')); //load module
    beforeEach(inject(function ($rootScope, $controller, _$location_) {
        $location = _$location_;
        scope = $rootScope.$new();

        createController = function() {
            return $controller('navController', {
                '$scope': scope
            });
        };
    }));

    it('should have a method to check if the path is active', function() {
        var controller = createController();
        $location.path('/about');
        expect($location.path()).toBe('/about');
        expect(scope.isActive('/about')).toBe(true);
        expect(scope.isActive('/contact')).toBe(false);
    });
});

