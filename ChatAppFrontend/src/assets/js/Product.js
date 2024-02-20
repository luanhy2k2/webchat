var app = angular.module("myApp", []);

app.controller("myCtrl", function ($scope, $http) {
  $http
    .get("https://localhost:7239/api/Product/get-all")
    .then(function (response) {
      $scope.products = response.data;
      console.log(response.data);
    });

  $scope.DeleteProduct = function (productID) {
    var confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (confirmDelete) {
      $http
        .delete(
          "https://localhost:7239/api/Product/delete-product/" + productID
        )
        .then(
          function (response) {
            alert("Xóa thành công");
            $http
              .get("https://localhost:7239/api/Product/get-all")
              .then(function (response) {
                $scope.products = response.data;
                console.log(response.data);
              });
          },
          function (error) {
            console.log(error);
          }
        );
    }
  };
  $http
    .get("https://localhost:7239/api/Category/GetAll")
    .then(function (response) {
      $scope.category = response.data;
      console.log(response.data);
    });
  $http
    .get("https://localhost:7239/api/Size/get-all")
    .then(function (response) {
      $scope.size = response.data;
      console.log(response.data);
    });

  $scope.AddProduct = function () {
    const data = {
      id: 0,
      proCatID: $scope.CategoryID_Create,
      proName: $scope.Name_Create,
      descriptions: $scope.Description_Create,
      image: "",
      sizeID: $scope.SizeID_Create,
      createDate: "2023-05-23T16:56:53.66Z",
      price: $scope.Price_Create
    };

    const fileInput = document.querySelector("#UploadFile");
    const file = fileInput.files[0];

    if (!file) {
      alert("Vui lòng chọn hình ảnh sản phẩm.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Gọi API để upload ảnh và lấy đường dẫn trả về
    $http({
      method: "POST",
      url: "https://localhost:7239/api/UploadFile/upload/Product",
      headers: {
        "Content-Type": undefined,
      },
      transformRequest: angular.identity,
      data: formData,
    })
      .then(function (response) {
        // Thêm đường dẫn ảnh vào thông tin sản phẩm
        data.image = "https://localhost:7239" + response.data.filePath;

        // Gọi API để thêm sản phẩm mới
        $http({
          method: "POST",
          url: "https://localhost:7239/api/Product/create-product",
          data: data,
        })
          .then(function (response) {
            console.log("Thêm sản phẩm thành công!");
            $http
              .get("https://localhost:7239/api/Product/get-all")
              .then(function (response) {
                $scope.products = response.data;
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  $scope.getProductByID = function (id) {
    $http.get("https://localhost:7021/api/Home/get-by-id/" + id).then(
      function (response) {
        $scope.ProductByID = response.data;
        console.log(response.data);
      },
      function (error) {
        console.log(error);
      }
    );
  };
  // $scope.updateProduct = function () {
  //   const data = {
  //     id: $scope.ProductByID.proID,
  //     proCatID: $scope.ProductByID.catID,
  //     proName: $scope.ProductByID.name,
  //     descriptions: $scope.ProductByID.descriptions,
  //     image: "",
  //     sizeID: $scope.ProductByID.sizeID,
  //     createDate: "2023-05-23T16:56:53.66Z",
  //     price: $scope.ProductByID.price,
  //   };

  //   const fileInput = document.querySelector("#UploadFile");
  //   const file = fileInput.files[0];

  //   if (!file) {
  //     alert("Vui lòng chọn hình ảnh sản phẩm.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   // Gọi API để upload ảnh và lấy đường dẫn trả về
  //   $http({
  //     method: "POST",
  //     url: "https://localhost:7239/api/UploadFile/upload/Product",
  //     headers: {
  //       "Content-Type": undefined,
  //     },
  //     transformRequest: angular.identity,
  //     data: formData,
  //   }).then(function (response) {
  //     // Thêm đường dẫn ảnh vào thông tin sản phẩm
  //     data.image = "https://localhost:7239" + response.data.filePath;

  //     $http.post("https://localhost:7239/api/Product/update-product", data).then(
  //       function (response) {
  //         // handle success
  //         alert("Sửa sản phẩm thành công");
  //         console.log(response);

  //         $http
  //           .get("https://localhost:7239/api/Product/get-all")
  //           .then(function (response) {
  //             $scope.products = response.data;
  //             console.log(response.data);
  //           });
  //         // do something after update successfully
  //       },
  //       function (response) {
  //         // handle error
  //         console.log(response);
  //         alert("Lỗi");
  //         // do something when update failed
  //       }
  //     );
  //   });
  // };
  $scope.updateProduct = function () {
    const data = {
      id: $scope.ProductByID.id,
      proCatID: 2,
      proName: $scope.ProductByID.proName,
      descriptions: $scope.ProductByID.descriptions,
      image: "",
      sizeID: 1,
      createdDate: "2023-04-24T02:55:09.805Z",
      price: $scope.ProductByID.price,
      name: $scope.ProductByID.name,
    
     
    };

    const fileInput = document.querySelector("#UploadFileEdit");
    const file = fileInput.files[0];

    if (!file) {
      alert("Vui lòng chọn hình ảnh sản phẩm.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Gọi API để upload ảnh và lấy đường dẫn trả về
    $http({
      method: "POST",
      url: "https://localhost:7239/api/UploadFile/upload/Product",
      headers: {
        "Content-Type": undefined,
      },
      transformRequest: angular.identity,
      data: formData,
    }).then(function (response) {
      // Thêm đường dẫn ảnh vào thông tin sản phẩm
      data.image = "https://localhost:7239" + response.data.filePath;

      $http.post("https://localhost:7239/api/Product/update-product", data).then(
        function (response) {
          // handle success
          alert("Sửa sản phẩm thành công");
          console.log(response);

          $http
            .get("https://localhost:7239/api/Product/get-all")
            .then(function (response) {
              $scope.products = response.data;
              console.log(response.data);
            });
          // do something after update successfully
        },
        function (response) {
          // handle error
          console.log(response);
          alert("Lỗi");
          // do something when update failed
        }
      );
    });
  };
});
