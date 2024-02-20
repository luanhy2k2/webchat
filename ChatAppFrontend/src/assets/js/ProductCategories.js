var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope, $http) {
  $http
    .get("https://localhost:7239/api/Category/GetAll")
    .then(function (response) {
      $scope.categories = response.data;
      console.log(response.data);
    });
  $scope.AddCategory = function () {
    const data = {
      id: 0,
      name: $scope.name,
    };
    $http({
      method: "POST",
      url: "https://localhost:7239/api/Category/Create",
      data: data,
    }).then(
      function (response) {
        alert("Thêm loại sản phẩm thành công");
        $http
          .get("https://localhost:7239/api/Category/GetAll")
          .then(function (response) {
            $scope.categories = response.data;
            console.log(response.data);
          });
      },
      function (error) {
        console.log(error);
      }
    );
  };
  $scope.DeleteCategory = function (categoryId) {
    var confirmDelete = confirm("Bạn có chắc chắn muốn xóa loại này?");
    if (confirmDelete) {
      $http
        .delete(
          "https://localhost:7239/api/Category/Delete/" + categoryId
        )
        .then(
          function (response) {
            console.log("Xóa sản phẩm thành công");
            alert("Xóa loại sản phẩm thành công");
            $http
              .get("https://localhost:7239/api/Category/GetAll")
              .then(function (response) {
                $scope.categories = response.data;
                console.log(response.data);
              });
          },
          function (error) {
            console.log(error);
          }
        );
    }
  };
});
