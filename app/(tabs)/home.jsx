import React, {  useState } from "react";
import { FlatList, StyleSheet, Text, View, Image, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts } from "../../lib/appwrite";
import VideoCard from "../../components/VideoCard";


const home = () => {
  const {data:posts, refetch} = useAppwrite(getAllPosts)
  const [refreshing, setRefreshing] = useState(false)


  const onRefresh =  async () => {
    setRefreshing(true)

    // logic to fetch
    await refetch()
    setRefreshing(false)
  }



  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard 
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}

        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome
                </Text>

                <Text className="text-2xl font-psemibold text-white ">
                  JsMastery
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />
                 
            <View className="w-full flex-1 pt-5 pb-8">
                <Text className="text-lg font-pregular text-gray-100 mb-3">
                  Latest Videos
                </Text>

                <Trending posts={posts ?? []}/>
            </View>
          </View>
        )}

        ListEmptyComponent={()=> (
          <EmptyState 
            title="No Videos Found"
            subtitle="No videos created Yet"
          />
        )}

        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      />
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});