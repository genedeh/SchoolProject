from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views 

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
urlpatterns = router.urls


# urlpatterns = [
#     path("users/",views.UserViewSet.as_view(), name="user-create-view"),
#     # path("users/<int:pk>/", views.UserRetrieveUpdateDestroy.as_view(), name="update")
# ]
