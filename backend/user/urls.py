from django.urls import path
from . import views 


urlpatterns = [
    path("login/",views.LoginView.as_view(), name="login"),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('users/', views.UserSearchView.as_view(), name='users'),
    path('add-user/',views.AddUserView.as_view(), name='add-user'),
    path('update-user/<int:pk>/', views.UpdateUserView.as_view(), name='update-user')
]
