from django.urls import path
from . import views 


urlpatterns = [
    path("classrooms/<int:pk>/",views.ClassRoomRetrieveView.as_view(), name="classrooms"),
    path("classrooms/", views.ClassRoomListView.as_view(), name="classrooms"),
    path("subjects/", views.SubjectsListView.as_view(), name='subjects'),
    path("subjects/<int:pk>/", views.SubjectsRetrieveView.as_view(), name='subjects'),
    path("results/", views.ResultsListView.as_view(), name="results"),
    path("results/<int:pk>/", views.ResultRetrieveView.as_view(), name='results'),
]
