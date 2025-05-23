# from django.urls import path
# from . import views

# urlpatterns = [
#     path("workspaces/", views.WorkspaceListCreateView.as_view()),
#     path("channels/", views.ChannelListCreateView.as_view()),
#     path("channels/<int:channel_id>/messages/", views.MessageListView.as_view()),
#     path("dms/<int:dm_group_id>/messages/", views.MessageListView.as_view()),
# ]

from django.urls import path
from . import views

urlpatterns = [
    # Workspace URLs
    path('workspaces/', views.WorkspaceListCreateView.as_view()),
    path('workspaces/<int:pk>/', views.WorkspaceRetrieveUpdateDestroyView.as_view()),
    
    # Channel URLs
    path('channels/', views.ChannelListCreateView.as_view()),
    path('channels/<int:pk>/', views.ChannelRetrieveUpdateDestroyView.as_view()),
    
    # Direct Message Group URLs
    path('dm-groups/', views.DirectMessageGroupListCreateView.as_view()),
    path('dm-groups/<int:pk>/', views.DirectMessageGroupRetrieveUpdateDestroyView.as_view()),
    
    # Message URLs
    path('channels/<int:channel_id>/messages/', views.MessageListCreateView.as_view()),
    path('dm-groups/<int:dm_group_id>/messages/', views.MessageListCreateView.as_view()),
    path('messages/<int:pk>/', views.MessageRetrieveUpdateDestroyView.as_view()),

    path('<str:room_name>/', views.room, name='room'),
]